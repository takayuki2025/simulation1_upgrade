<?php


use App\Jobs\AnalyzeEntityWithAtlasKernel;

class BrandController extends Controller
{
    public function store(Request $request)
    {
        $result = dispatch_sync(
            new AnalyzeEntityWithAtlasKernel([
                'entity_type' => 'brand',
                'raw_value' => $request->input('brand_name'),
                'known_assets_ref' => 'brands_v1',
            ])
        );

        return response()->json([
            'canonical_brand' => $result['canonical_value'],
            'confidence' => $result['confidence'],
        ]);
    }
}
