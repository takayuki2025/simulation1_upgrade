<?php

namespace App\Modules\Item\Domain\Service;

use Illuminate\Support\Facades\DB;

final class AtlasKernelService
{
    private string $assetPath;

    public function __construct()
    {
        $this->assetPath = base_path(
            '../python_batch/atlaskernel/src/atlaskernel/assets'
        );
    }

    /**
     * AtlasKernel v1.6-stable
     */
    public function analyzeItem(
        int $itemId,
        string $rawText,
        ?int $tenantId = null
    ): void {
        DB::transaction(function () use ($itemId, $rawText) {

            /* ==================================================
               0. 正規化
            ================================================== */
            $text = $this->normalize($rawText);

            $confidence = [
                'brand'     => 0.0,
                'condition' => 0.0,
                'color'     => 0.0,
            ];

            /* ==================================================
               1. 辞書ロード（★実ファイル名に合わせる）
            ================================================== */
            $brandDict     = $this->loadDict('brands_v1.txt');
            $brandAlias    = $this->loadAlias('brand_alias.txt');

            // ★ 修正点①：実在するファイル名に合わせる
            $conditionDict = $this->loadDict('conditions_v1.txt');
            $colorDict     = $this->loadDict('colors_v1.txt');

            /* ==================================================
               1.5 brand 検索用辞書を合成
            ================================================== */
            $brandSearchDict = array_unique(array_merge(
                $brandDict,
                array_keys($brandAlias)
            ));

            /* ==================================================
               1.6 alias を text に事前適用
            ================================================== */
            // foreach ($brandAlias as $from => $to) {
            //     $text = str_replace($from, $to, $text);
            // }

            logger()->info('[AtlasKernel] preprocessed text', [
                'raw'        => $rawText,
                'normalized' => $text,
            ]);

            /* ==================================================
               2. 抽出（優先順）
            ================================================== */
            [$condition, $text, $confidence['condition']]
                = $this->extractOne($text, $conditionDict);

            [$color, $text, $confidence['color']]
                = $this->extractOne($text, $colorDict);

            [$brands, $text] = $this->extractMany($text, $brandSearchDict);

            $confidence['brand'] = count($brands) > 0 ? 0.9 : 0.0;

            logger()->info('[AtlasKernel] extracted', [
                'brands'    => $brands,
                'condition' => $condition,
                'color'     => $color,
            ]);

            /* ==================================================
               3. brand alias 正規化
            ================================================== */

            $brands = array_map(function ($b) use ($brandAlias) {
                $b = $this->normalize($b);
                return $brandAlias[$b] ?? $b;
            }, $brands);


            $primaryBrand = $brands[0] ?? null;

            /* ==================================================
               4. DB resolve（★後方互換を追加）
            ================================================== */
            $brandId     = $this->resolveEntityId('brand_entities', $primaryBrand);
            $conditionId = $this->resolveEntityId('condition_entities', $condition);
            $colorId     = $this->resolveEntityId('color_entities', $color);

            /* ==================================================
               5. item_entities（スナップショット）
            ================================================== */
            DB::table('item_entities')
                ->where('item_id', $itemId)
                ->where('is_latest', true)
                ->update(['is_latest' => false]);

            DB::table('item_entities')->insert([
                'item_id'             => $itemId,
                'brand_entity_id'     => $brandId,
                'condition_entity_id' => $conditionId,
                'color_entity_id'     => $colorId,
                'confidence'          => json_encode($confidence, JSON_UNESCAPED_UNICODE),
                'is_latest'           => true,
                'generated_version'   => 'v1.6',
                'generated_at'        => now(),
                'created_at'          => now(),
                'updated_at'          => now(),
            ]);

            /* ==================================================
               6. item_entity_tags（brand 複数）
            ================================================== */
            DB::table('item_entity_tags')
                ->where('item_id', $itemId)
                ->delete();



            foreach ($brands as $brand) {
                $entityId = $this->resolveEntityId('brand_entities', $brand);

                $displayName = $entityId
                    ? DB::table('brand_entities')->where('id', $entityId)->value('display_name')
                    : $brand; // fallback（未知ブランド）

                DB::table('item_entity_tags')->insert([
                    'item_id'      => $itemId,
                    'tag_type'     => 'brand',
                    'entity_id'    => $entityId,
                    'display_name' => $displayName,
                    'confidence'   => 0.9,
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
            }



            if ($condition) {
                DB::table('item_entity_tags')->insert([
                    'item_id'      => $itemId,
                    'tag_type'     => 'condition',
                    'entity_id'    => $conditionId, // null OK
                    'display_name' => $condition,
                    'confidence'   => $confidence['condition'],
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
            }

            if ($color) {
                DB::table('item_entity_tags')->insert([
                    'item_id'      => $itemId,
                    'tag_type'     => 'color',
                    'entity_id'    => $colorId, // null OK
                    'display_name' => $color,
                    'confidence'   => $confidence['color'],
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
            }



            /* ==================================================
               7. audit
            ================================================== */
            DB::table('item_entity_audits')->insert([
                'item_id'    => $itemId,
                'confidence' => json_encode($confidence, JSON_UNESCAPED_UNICODE),
                'raw_text'   => $rawText,
                'created_at' => now(),
            ]);
        });
    }

    /* ======================================================
       正規化
    ====================================================== */
    private function normalize(string $text): string
    {
        return trim(mb_convert_kana($text, 'asKVc', 'UTF-8'));
    }

    /* ======================================================
       辞書ロード
    ====================================================== */
    private function loadDict(string $file): array
    {
        $path = "{$this->assetPath}/{$file}";
        if (!file_exists($path)) {
            return [];
        }

        return array_map(
            fn ($v) => $this->normalize($v),
            file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES)
        );
    }

    private function loadAlias(string $file): array
    {
        $map = [];
        $path = "{$this->assetPath}/{$file}";
        if (!file_exists($path)) {
            return $map;
        }

        foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            [$from, $to] = array_map('trim', explode(',', $line, 2));
            $map[$this->normalize($from)] = $this->normalize($to);
        }

        return $map;
    }

    /* ======================================================
       抽出
    ====================================================== */
    private function extractOne(string $text, array $dict): array
    {
        usort($dict, fn ($a, $b) => mb_strlen($b) <=> mb_strlen($a));

        foreach ($dict as $word) {
            if (mb_strpos($text, $word) !== false) {
                $len = mb_strlen($word);
                $confidence = min(1.0, 0.5 + ($len / max(mb_strlen($text), 1)));
                return [$word, str_replace($word, '', $text), $confidence];
            }
        }
        return [null, $text, 0.0];
    }

    private function extractMany(string $text, array $dict): array
    {
        $found = [];
        usort($dict, fn ($a, $b) => mb_strlen($b) <=> mb_strlen($a));

        foreach ($dict as $word) {
            if (mb_strpos($text, $word) !== false) {
                $found[] = $word;
                $text = str_replace($word, '', $text);
            }
        }
        return [$found, $text];
    }

    /* ======================================================
       DB resolve（★display_name も見る）
    ====================================================== */
    private function resolveEntityId(string $table, ?string $value): ?int
    {
        if (!$value) {
            return null;
        }

        $normalized = $this->normalize($value);

        $query = DB::table($table)->where('canonical_name', $normalized);

        // brand_entities だけ display_name を見る
        if ($table === 'brand_entities') {
            $query->orWhere('display_name', $value);
        }

        return $query->value('id');
    }
}
