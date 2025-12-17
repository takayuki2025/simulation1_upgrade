<?php

App\Http\Controllers;

use App\Services\Item\ItemAnalysisService;

class Controller extends Controller
{
    public function store(Request $request, ItemAnalysisService $analysis)
    {
        $item = Item::create($request->validated());

        // 👇 業務イベントとして解析投入
        $analysis->analyzeAfterCreate($item);

        return response()->json($item, 201);
    }

    public function update(Request $request, Item $item, ItemAnalysisService $analysis)
    {
        $item->update($request->validated());

        $analysis->analyzeAfterUpdate($item);

        return response()->json($item);
    }
}
