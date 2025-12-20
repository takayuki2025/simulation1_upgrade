<?php

namespace App\Modules\Item\Domain\Service;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class AtlasKernelService
{
    /**
     * v1:
     * - items の raw 情報（brand などの自由入力）から
     * - brand / condition / color を解決し
     * - item_entities に最新スナップショットを作成する
     *
     * 前提:
     * - item_entities には is_latest カラムが存在する
     * - brand_entities / condition_entities / color_entities は
     *   すでに辞書として投入済み
     */
    public function analyzeItem(
        int $itemId,
        string $rawText,
        ?int $tenantId = null, // v1 では未使用（将来拡張用）
    ): void {
        DB::transaction(function () use ($itemId, $rawText) {

            // -------------------------------------------------
            // 1. tokenize
            // -------------------------------------------------
            $tokens = $this->tokenize($rawText);

            // -------------------------------------------------
            // 2. resolve entities
            // -------------------------------------------------
            $brandId     = $this->resolveBrand($tokens);
            $conditionId = $this->resolveCondition($tokens);
            $colorId     = $this->resolveColor($tokens);

            // -------------------------------------------------
            // 3. 既存 latest を false に（履歴は残す）
            // -------------------------------------------------
            DB::table('item_entities')
                ->where('item_id', $itemId)
                ->where('is_latest', true)
                ->update([
                    'is_latest'  => false,
                    'updated_at' => now(),
                ]);

            // -------------------------------------------------
            // 4. 新しい snapshot を追加
            // -------------------------------------------------
            DB::table('item_entities')->insert([
                'item_id'             => $itemId,
                'brand_entity_id'     => $brandId,
                'condition_entity_id' => $conditionId,
                'color_entity_id'     => $colorId,

                'is_latest'           => true,
                'generated_version'   => 'v1',
                'generated_at'        => now(),

                'created_at'          => now(),
                'updated_at'          => now(),
            ]);
        });
    }

    /* ======================================================
       Tokenize
       - 空白 / カンマ / 日本語区切り / 記号 を吸収
    ====================================================== */

    private function tokenize(string $raw): array
    {
        if ($raw === '') {
            return [];
        }

        return array_values(array_filter(array_map(
            static fn ($v) => trim($v),
            preg_split('/[\s|,、・\/]+/u', $raw)
        )));
    }

    /* ======================================================
       Brand
       - normalized_key 完全一致（v1）
       - tenant 概念は v2 以降で導入
    ====================================================== */

    private function resolveBrand(array $tokens): ?int
    {
        foreach ($tokens as $token) {
            $key = Str::lower($token);

            $entity = DB::table('brand_entities')
                ->where('normalized_key', $key)
                ->first();

            if ($entity !== null) {
                return (int) $entity->id;
            }
        }

        return null;
    }

    /* ======================================================
       Condition
    ====================================================== */

    private function resolveCondition(array $tokens): ?int
    {
        foreach ($tokens as $token) {
            $entity = DB::table('condition_entities')
                ->where('canonical_name', $token)
                ->first();

            if ($entity !== null) {
                return (int) $entity->id;
            }
        }

        return null;
    }

    /* ======================================================
       Color
    ====================================================== */

    private function resolveColor(array $tokens): ?int
    {
        foreach ($tokens as $token) {
            $entity = DB::table('color_entities')
                ->where('canonical_name', $token)
                ->first();

            if ($entity !== null) {
                return (int) $entity->id;
            }
        }

        return null;
    }
}
