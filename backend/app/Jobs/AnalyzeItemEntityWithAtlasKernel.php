<?php

namespace App\Jobs;

use App\Models\ItemEntity;
use App\Models\ItemEntityAudit;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Process;

class AnalyzeItemEntityWithAtlasKernel implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(
        public int $itemId,
        public string $entityType,
        public string $rawValue,
        public ?string $knownAssetsRef = null,
        public string $reason = 'manual_reanalyze', // ★追加
        public array $context = []
    ) {
    }

    public $tries = 3;
    public $timeout = 60;
    public $backoff = [10, 30, 60];

    public function handle(): void
    {
        $input = [
            'entity_type' => $this->entityType,
            'raw_value' => $this->rawValue,
        ];

        if ($this->knownAssetsRef) {
            $input['known_assets_ref'] = $this->knownAssetsRef;
        }

        $jsonLine = json_encode($input, JSON_UNESCAPED_UNICODE);



        $run = Process::run(
            ['bash', '-lc', 'atlaskernel'],
            null,
            $jsonLine . "\n"
        );



        if (!$run->successful()) {
            throw new \RuntimeException("atlaskernel failed: " . $run->errorOutput());
        }

        $payload = json_decode(trim($run->output()), true);

        if (!is_array($payload)) {
            throw new \RuntimeException("atlaskernel output is not JSON");
        }

        // ★① 先に「過去を false」にする（重要）
        ItemEntity::where('item_id', $this->itemId)
            ->where('entity_type', $this->entityType)
            ->update(['is_latest' => false]);

        // extensions 構築
        $extensions = $payload['extensions'] ?? [];
        $extensions['reanalyze'] = [
            'reason' => $this->reason,
            'at' => now()->toISOString(),
        ];

        // ★② 最新として保存
        $entity = ItemEntity::create([
            'item_id' => $this->itemId,
            'entity_type' => $payload['entity_type'],
            'raw_value' => $payload['raw_value'],
            'canonical_value' => $payload['canonical_value'],
            'confidence' => (float) $payload['confidence'],
            'decision' => $payload['decision'],
            'policy_version' => data_get($payload, 'extensions.policy_trace.policy_schema'),
            'schema_version' => $payload['schema_version'],
            'engine_version' => $payload['engine_version'],
            'extensions' => $extensions,
            'is_latest' => true,
        ]);

        // ★③ audit は不変ログとして保存
        ItemEntityAudit::create([
            'item_entity_id' => $entity->id,
            'decision' => $entity->decision,
            'confidence' => $entity->confidence,
            'payload' => $payload,
            'extensions' => $extensions,
        ]);
    }
}
