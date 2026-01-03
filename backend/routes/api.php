<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/
Route::get('/health', fn () => ['status' => 'ok']);

/*
|--------------------------------------------------------------------------
| 🔐 Auth : Firebase → JWT（実装済・検証対象）
|--------------------------------------------------------------------------
*/
use App\Modules\Auth\Presentation\Http\Controllers\{
    FirebaseAuthController,
    TokenController,
    MeController,
    DeviceSessionsController
};

// Login / Register
Route::post('/login_or_register', [FirebaseAuthController::class, 'loginOrRegister']);

// Refresh Token
Route::post('/auth/refresh', [TokenController::class, 'refresh']);

// メール認証の際のメール再送信
use App\Modules\Auth\Presentation\Http\Controllers\ResendEmailVerificationController;

Route::middleware(['auth.jwt.optional'])
    ->post(
        '/email/verification-notification',
        ResendEmailVerificationController::class
    );



use App\Modules\Shop\Presentation\Http\Controllers\ShopController;

Route::middleware(['auth.jwt'])->group(function () {
    Route::post('/shops', [ShopController::class, 'create']);
    Route::get('/shops/me', [ShopController::class, 'me']);
});



// === Shop / Tenant ===
use App\Modules\Item\Presentation\Http\Controllers\{
    ShopShowController,
    ShopItemListController
};

Route::prefix('shops/{shop_code}')
    ->middleware(['shop.context',])
    ->group(function () {
        Route::get('/', ShopShowController::class);
        Route::get('/items', ShopItemListController::class);
    });

/*
|--------------------------------------------------------------------------
| 🔐 JWT Protected（最低限）
|--------------------------------------------------------------------------
*/
Route::middleware(['auth.jwt'])->group(function () {
    Route::get('/me', MeController::class);
    Route::post('/logout', [FirebaseAuthController::class, 'logout']);

    // セッション確認（実装済）
    Route::get('/auth/sessions', [DeviceSessionsController::class, 'list']);
});

/*
|--------------------------------------------------------------------------
| 🌐 Public Item API（今回の検証メイン）
|--------------------------------------------------------------------------
*/
use App\Modules\Item\Presentation\Http\Controllers\{
    ItemListController,
    //  ItemSearchController,
    ItemDetailController
};
use App\Modules\Item\Presentation\Http\Controllers\PublicCatalogController;
use App\Modules\Search\Presentation\Http\Controllers\PublicItemSearchController;
use App\Modules\Search\Presentation\Http\Controllers\ShopItemSearchController;

// ✅ 新：一覧 / 検索（DDD 分離済）




Route::middleware(['auth.jwt.optional'])->group(function () {

    Route::get('/items/public', PublicCatalogController::class);

    Route::get('/search/items', PublicItemSearchController::class);

    // ★ Shop 専用検索
    Route::get('/search/shop-items', ShopItemSearchController::class);
});







// Route::middleware('auth.jwt.optional')->group(function () {
//     Route::get('/items/public', PublicItemListController::class);
// });

Route::middleware('auth.jwt.optional')
    ->get('/item/{id}', ItemDetailController::class);









// Route::get('/public/items', PublicItemListController::class);

// Route::middleware('auth.jwt')->group(function () {
//     Route::get('/items', ItemListController::class); // Domain
// });







use App\Modules\Item\Presentation\Http\Controllers\CreateItemDraftController;
use App\Modules\Item\Presentation\Http\Controllers\UploadItemDraftImageController;
use App\Modules\Item\Presentation\Http\Controllers\PublishItemController;
use App\Modules\Item\Presentation\Http\Controllers\DeleteItemDraftController;

Route::middleware(['auth.jwt'])->group(function () {
    Route::post('/items/drafts', CreateItemDraftController::class);
    Route::post('/items/drafts/{draftId}/image', UploadItemDraftImageController::class);
    Route::post('/items/drafts/{draftId}/publish', PublishItemController::class);
});
Route::middleware(['auth.jwt'])->group(function () {
    Route::delete(
        '/items/drafts/{draftId}',
        DeleteItemDraftController::class
    );
});




use App\Http\Controllers\ItemEntityReviewController;
use App\Http\Controllers\ItemEntityAuditController;
use App\Http\Controllers\EntityKpiController;

//データー加工保管処理
Route::get('/entity-reviews', [ItemEntityReviewController::class, 'index']);
Route::post('/entity-reviews/{id}/approve', [ItemEntityReviewController::class, 'approve']);
Route::post('/entity-reviews/{id}/reject', [ItemEntityReviewController::class, 'reject']);

Route::get(
    '/item-entities/{id}/audits',
    [ItemEntityAuditController::class, 'index']
);

Route::get('/entity-kpis', EntityKpiController::class);



/*
|--------------------------------------------------------------------------
| 🧊 以下は未検証・未使用（削除せずコメント化）
|--------------------------------------------------------------------------
*/

// use App\Modules\Item\Presentation\Http\Controllers\ItemDetailController;

// use App\Modules\Item\Presentation\Http\Controllers\ItemReadController;
// === Favorite / Comment ===

use App\Modules\Reaction\Presentation\Http\Controllers\FavoriteController;
use App\Modules\Comment\Presentation\Http\Controllers\PostCommentController;

// item detail（ログインでもゲストでも見れる）

Route::get('/items/{itemId}', ItemDetailController::class)
    ->whereNumber('itemId')
    ->middleware('auth.jwt.optional');


// mylist（ログイン必須にして事故を避ける）
Route::get('/items/favorite', [FavoriteController::class, 'index'])
    ->middleware('auth.jwt');

// reactions は API 専用 prefix
Route::middleware('auth.jwt')->group(function () {
    Route::post('/reactions/items/{itemId}/favorite', [FavoriteController::class, 'add'])
        ->whereNumber('itemId');

    Route::delete('/reactions/items/{itemId}/favorite', [FavoriteController::class, 'remove'])
        ->whereNumber('itemId');
});


// Route::middleware('auth.jwt.optional')->group(function () {
//     Route::get('/items/favorite', [FavoriteController::class, 'index']);
// });




// Route::middleware('auth.jwt.optional')->group(function () {
//     Route::get('/items/favorite', [FavoriteController::class, 'index']);
//     // Route::get('/items/{itemId}', [ItemReadController::class, 'show']);
// });

// Route::middleware('auth.jwt')->group(function () {
//     Route::post('/items/{itemId}/favorite', [FavoriteController::class, 'add']);
//     Route::delete('/items/{itemId}/favorite', [FavoriteController::class, 'remove']);
// });
// Route::middleware('auth.jwt.optional')->group(function () {
//     Route::get('/items/{itemId}/favorite', [FavoriteController::class, 'show']);
// });


// use App\Modules\Item\Presentation\Http\Controllers\ItemReadController;

// Route::get('/items/{itemId}', [ItemReadController::class, 'show']);



// Route::prefix('items')->group(function () {
//     Route::get('{item}', [ItemReadController::class, 'show']);
// });

// Route::get('/items/{itemId}', [ItemReadController::class, 'show'])
//     ->middleware('auth.jwt.optional');



//データー加工後表示
// use App\Modules\Item\Presentation\Http\Controllers\ItemReadController;

// Route::withoutMiddleware(['throttle:api'])
//     ->get('/items/{itemId}', [ItemReadController::class, 'show'])
//     ->whereNumber('itemId');






Route::middleware(['auth.jwt'])->group(function () {
    Route::post('/comment', PostCommentController::class);
});




// === MyPage / User ===
use App\Modules\User\Presentation\Http\Controllers\MypageController;

Route::middleware('auth.jwt')->prefix('mypage')->group(function () {
    Route::get('/profile', [MypageController::class, 'profile']);
    Route::get('/sell', [MypageController::class, 'sellItems']);
    Route::get('/bought', [MypageController::class, 'boughtItems']);

    Route::patch('/profile', [MypageController::class, 'updateProfile']);
    Route::post('/profile/image', [MypageController::class, 'updateProfileImage']);

});








use App\Modules\Item\Infrastructure\Persistence\Query\ItemReadRepository;
use App\Modules\Item\Presentation\Http\Resources\ItemReadResource;

Route::get('/__debug/item/{id}', function ($id) {
    $item = app(ItemReadRepository::class)
        ->findWithDisplayEntities((int)$id);

    if (!$item) {
        return response()->json(['error' => 'not found'], 404);
    }

    return response()->json(
        ItemReadResource::fromRow($item)
    );
});




use App\Modules\Order\Presentation\Http\Controllers\OrderController;

Route::middleware(['auth.jwt'])->group(function () {
    Route::post('/orders', [OrderController::class, 'create']);
    //     Route::get('/orders/{orderId}', [OrderController::class, 'detail']);
});





use App\Modules\Payment\Presentation\Http\Controllers\PaymentController;
use App\Modules\Payment\Presentation\Http\Controllers\StripeWebhookController;
use App\Modules\Payment\Presentation\Http\Controllers\PaymentReadController;

Route::middleware(['auth.jwt'])->group(function () {
    Route::post('/payments/start', [PaymentController::class, 'start']);
});



Route::post('/webhooks/stripe', StripeWebhookController::class);




Route::middleware('auth.jwt.optional')->group(function () {
    Route::get('/payments/latest-by-order', [PaymentReadController::class, 'latestByOrder']);
});






use App\Modules\Shipment\Presentation\Http\Controllers\ShipmentController;
use App\Modules\Shipment\Presentation\Http\Controllers\AdminShipmentKpiController;
use App\Modules\Shipment\Presentation\Http\Controllers\CustomerShipmentController;
use App\Modules\Shipment\Presentation\Http\Controllers\ShopShipmentListController;

/*
|--------------------------------------------------------------------------
| Shipment (FlexVelocity_v1)
|--------------------------------------------------------------------------
*/


// Shop Dashboard（A フェーズの正解）
Route::prefix('shops/{shop_code}')
    ->middleware([
        'auth.jwt',
        'shop.context',
        'shop.role:owner,manager,staff'
    ])
    ->group(function () {

        Route::get('/shipments', ShopShipmentListController::class);

        // ★ 手動作成（A フェーズ唯一の入口）
        Route::post(
            '/dashboard/orders/{orderId}/shipment',
            [ShipmentController::class, 'store']
        );
    });


// Create shipment (OrderEvent::PAID から呼ばれる想定)
// （Bから一旦コメント化のみ！！！！！！！）
// Route::prefix('shipments')
//     ->middleware(['auth.jwt']) // shop スコープ前提
//     ->group(function () {
//         Route::post('/', [ShipmentController::class, 'store']);
//         Route::post('{id}/pack', [ShipmentController::class, 'pack']);
//         Route::post('{id}/ship', [ShipmentController::class, 'ship']);
//         Route::post('{id}/in-transit', [ShipmentController::class, 'markInTransit']);
//         Route::post('{id}/deliver', [ShipmentController::class, 'deliver']);
//     });


Route::get('/admin/shipments/kpi', AdminShipmentKpiController::class)
    ->middleware(['auth.jwt', 'role:admin']);


Route::get('/me/shipments/{id}', [CustomerShipmentController::class, 'show'])
    ->middleware(['auth.jwt']);









use App\Modules\Order\Presentation\Http\Controllers\GetMyOrderShipmentController;

Route::middleware(['auth.jwt'])->group(function () {
    Route::get(
        '/me/orders/{orderId}/shipment',
        GetMyOrderShipmentController::class
    );
});



use App\Modules\Order\Presentation\Http\Controllers\MeOrderController;
use App\Modules\Order\Presentation\Http\Controllers\OrderReadController;

Route::middleware(['auth.jwt'])->group(function () {
    Route::get('/me/orders', [MeOrderController::class, 'index']);
    Route::get('/me/orders/{orderId}', [OrderReadController::class, 'show']);
});






use App\Modules\Order\Presentation\Http\Controllers\ConfirmOrderAddressController;

Route::middleware(['auth.jwt'])->group(function () {
    Route::post(
        '/orders/{orderId}/confirm-address',
        ConfirmOrderAddressController::class
    );
});






use App\Modules\User\Presentation\Http\Controllers\UserAddressController;

Route::middleware('auth.jwt')->group(function () {
    Route::get('/me/addresses/primary', [UserAddressController::class, 'primary']);
});







use App\Modules\Order\Presentation\Http\Controllers\ShopOrderShipmentController;
use App\Modules\Order\Presentation\Http\Controllers\ShopOrderListController;

// === Shop / Public View ===
Route::prefix('shops/{shop_code}')
    ->middleware(['shop.context'])
    ->group(function () {
        Route::get('/', ShopShowController::class);
        Route::get('/items', ShopItemListController::class);
    });

// =======================================================
// 🏪 Shop Dashboard / Management（★確定ルート）
// =======================================================
Route::prefix('shops/{shop_code}')
    ->middleware([
        'auth.jwt',
        'shop.context',
        'shop.role:owner,manager,staff'
    ])
    ->group(function () {

        // ---- Dashboard ----
        Route::get('/dashboard/orders', ShopOrderListController::class);

        Route::get(
            '/dashboard/orders/{orderId}/shipment',
            ShopOrderShipmentController::class
        );

        // ---- Shipment ----
        Route::get('/shipments', ShopShipmentListController::class);
    });








use App\Modules\Shipment\Presentation\Http\Controllers\PackShipmentController;
use App\Modules\Shipment\Presentation\Http\Controllers\ShipShipmentController;
use App\Modules\Shipment\Presentation\Http\Controllers\InTransitShipmentController;
use App\Modules\Shipment\Presentation\Http\Controllers\DeliverShipmentController;

Route::prefix('shipments/{shipmentId}')
    ->middleware(['auth.jwt'])
    ->group(function () {
        Route::post('pack', PackShipmentController::class);
        Route::post('ship', ShipShipmentController::class);
        Route::post('in-transit', InTransitShipmentController::class);
        Route::post('deliver', DeliverShipmentController::class);
    });
