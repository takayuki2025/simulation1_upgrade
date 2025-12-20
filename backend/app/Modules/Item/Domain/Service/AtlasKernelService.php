<?php

namespace App\Modules\Item\Domain\Service;

use Illuminate\Support\Facades\DB;

final class AtlasKernelService
{
    private string $assetPath;

    public function __construct()
    {
        /**
         * Python 側 AtlasKernel と共有する辞書ディレクトリ
         *
         * python_batch/
         *   atlasKernel/
         *     src/atlasKernel/assets/
         *       - brand.txt
         *       - brand_alias.txt
         *       - condition.txt
         *       - color.txt
         */


        $this->assetPath = base_path(
            '../python_batch/atlaskernel/src/atlaskernel/assets'
        );


    }

    /**
     * AtlasKernel v1.6
     *
     * - rawText を正規化
     * - condition → color → brand の順で抽出
     * - brand は複数抽出（extractMany）
     * - item_entities : 代表スナップショット
     * - item_entity_tags : 表示・検索用タグ（複数）
     * - audit に confidence / raw_text を保存
     */
    public function analyzeItem(
        int $itemId,
        string $rawText,
        ?int $tenantId = null
    ): void {
        DB::transaction(function () use ($itemId, $rawText) {

            // ==================================================
            // 0. 正規化（超重要）
            // ==================================================
            $text = $this->normalize($rawText);

            $confidence = [
                'brand'     => 0.0,
                'condition' => 0.0,
                'color'     => 0.0,
            ];

            // ==================================================
            // 1. 辞書ロード
            // ==================================================
            $brandDict     = $this->loadDict('brands_v1.txt');
            $brandAlias    = $this->loadAlias('brand_alias.txt');
            $conditionDict = $this->loadDict('condition.txt');
            $colorDict     = $this->loadDict('color.txt');




            // ==================================================
            // 1.5 brand 検索用辞書を合成（canonical + alias）
            // ==================================================
            $brandSearchDict = array_unique(array_merge(
                $brandDict,
                array_keys($brandAlias)
            ));




            // ==================================================
            // 🔥 1.6 alias を text に事前適用（ここが今回の核心）
            // ==================================================
            foreach ($brandAlias as $from => $to) {
                $text = str_replace($from, $to, $text);
            }

            logger()->info('[AtlasKernel] preprocessed text', [
                'raw' => $rawText,
                'normalized' => $text,
            ]);




            // ==================================================
            // 2. 抽出（優先順）
            // ==================================================
            // condition（単一）
            [$condition, $text, $confidence['condition']]
                = $this->extractOne($text, $conditionDict);

            // color（単一）
            [$color, $text, $confidence['color']]
                = $this->extractOne($text, $colorDict);

            // brand（複数）

            [$brands, $text] = $this->extractMany($text, $brandSearchDict);



            logger()->info('[AtlasKernel] asset path check', [
                'assetPath' => $this->assetPath,
                'exists' => is_dir($this->assetPath),
                'files' => is_dir($this->assetPath) ? scandir($this->assetPath) : null,
            ]);



            logger()->info('[AtlasKernel] brands extracted', [
                'raw_text' => $rawText,
                'normalized_text' => $text,
                'brand_dict' => $brandDict,
                'brands' => $brands,
            ]);


            $confidence['brand'] = count($brands) > 0 ? 0.9 : 0.0;

            // ==================================================
            // 3. brand alias 正規化（複数）
            // ==================================================

            $brands = array_map(function ($b) use ($brandAlias) {
                $normalized = $brandAlias[$b] ?? $b;
                return $this->normalize($normalized);
            }, $brands);


            // 代表ブランド（先頭）
            $primaryBrand = $brands[0] ?? null;

            // ==================================================
            // 4. DB resolve（ID 取得）
            // ==================================================
            $brandId     = $this->resolveEntityId('brand_entities', $primaryBrand);
            $conditionId = $this->resolveEntityId('condition_entities', $condition);
            $colorId     = $this->resolveEntityId('color_entities', $color);

            // ==================================================
            // 5. item_entities（スナップショット）
            // ==================================================
            DB::table('item_entities')
                ->where('item_id', $itemId)
                ->where('is_latest', true)
                ->update(['is_latest' => false]);

            DB::table('item_entities')->insert([
                'item_id'             => $itemId,
                'brand_entity_id'     => $brandId,
                'condition_entity_id' => $conditionId,
                'color_entity_id'     => $colorId,
                'confidence'          => json_encode($confidence),
                'is_latest'           => true,
                'generated_version'   => 'v1.6',
                'generated_at'        => now(),
                'created_at'          => now(),
                'updated_at'          => now(),
            ]);

            // ==================================================
            // 6. item_entity_tags（複数タグ）
            // ==================================================
            // 既存タグ削除（v1 は単純 delete）
            DB::table('item_entity_tags')
                ->where('item_id', $itemId)
                ->delete();

            foreach ($brands as $brand) {
                $entityId = $this->resolveEntityId('brand_entities', $brand);

                if ($entityId) {

                    DB::table('item_entity_tags')->insert([
                        'item_id'      => $itemId,
                        'tag_type'     => 'brand',
                        'entity_id'    => $entityId,
                        'display_name' => $brand,
                        'confidence'   => 0.9,
                        'created_at'   => now(),
                        'updated_at'   => now(),
                    ]);

                }
            }

            // ==================================================
            // 7. audit（再学習・分析用）
            // ==================================================
            DB::table('item_entity_audits')->insert([
                'item_id'    => $itemId,
                'confidence' => json_encode($confidence),
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
        $text = mb_convert_kana($text, 'asKVc', 'UTF-8');
        // c = カタカナ → ひらがな（最重要）
        return trim($text);
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
       抽出ロジック
    ====================================================== */

    /**
     * 単一抽出（condition / color 用）
     */
    private function extractOne(string $text, array $dict): array
    {
        usort($dict, fn ($a, $b) => mb_strlen($b) <=> mb_strlen($a));

        foreach ($dict as $word) {
            if (mb_strpos($text, $word) !== false) {
                $len = mb_strlen($word);
                $confidence = min(
                    1.0,
                    0.5 + ($len / max(mb_strlen($text), 1))
                );

                $text = str_replace($word, '', $text);
                return [$word, $text, $confidence];
            }
        }

        return [null, $text, 0.0];
    }

    /**
     * 複数抽出（brand 用）
     */
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
       DB resolve
    ====================================================== */

    private function resolveEntityId(string $table, ?string $canonical): ?int
    {
        if (!$canonical) {
            return null;
        }


        return DB::table($table)
            ->whereRaw('canonical_name = ?', [$this->normalize($canonical)])
            ->value('id');

    }
}
