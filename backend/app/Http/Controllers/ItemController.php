<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Http\Requests\ProfileRequest;
use App\Http\Requests\ProfileImageRequest;
use App\Http\Requests\CommentRequest;
use App\Http\Requests\AddressRequest;
use App\Http\Requests\ExhibitionRequest;
use App\Http\Requests\PurchaseRequest;
use App\Models\Item;
use App\Models\User;
use App\Models\OrderHistory;
use App\Models\Comment;
use App\Models\Good;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Stripe\StripeClient;

class ItemController extends Controller
{
    // フロントページを表示し、持続検索機能とタブの切り替えを処理します。
    // NuxtからのAPIリクエストに対応するため、JSONレスポンスに変更します。
    public function index(Request $request): JsonResponse
    {
        
// 💡 暫定デバッグ: 認証状態に関わらず、正常なJSONレスポンスを返す
return response()->json([
    'items' => [], // 空の配列を返す
    'current_tab' => $request->query('tab', 'all'),
    'debug_message' => 'Controller logic skipped for debug.',
], 200);

        // ヘッダー情報のデバッグログ
        Log::info('FINAL_AUTHORIZATION_HEADER_CHECK: ' . $request->header('Authorization'));
        $allHeaders = $request->headers->all();
        Log::info("ITEM_CONTROLLER_HEADER_DUMP: " . json_encode($allHeaders));
        Log::info("ITEM_CONTROLLER_AUTH_HEADER_FINAL_CHECK: " . ($request->header('Authorization') ?? 'N/A'));

        // URLのGETパラメータ'tab'を取得。デフォルトは'all'
        $tab = $request->query('tab', 'all');

        // URLのGETパラメータ'all_item_search'を取得
        $searchQuery = $request->query('all_item_search');

        // ★★★ 認証状態の取得 ★★★
        // Request::user()からユーザーを取得 (Sanctum認証ミドルウェアが設定した場合)
        $user = $request->user();

        // Authファサードからもユーザーを取得（$userがnullの場合にフォールバックとして使用可能だが、ここではデバッグ用）
        $authFacadeUser = Auth::user();

        // 💡 認証ユーザーIDは $user の id に基づく（なければ null）
        $authId = $user ? $user->id : ($authFacadeUser ? $authFacadeUser->id : null);

        // ログの出力（デバッグ情報）
        Log::info("ItemController@index called. Resolved AuthID: " . ($authId ?? 'N/A'));
        $authCheckSanctum = Auth::guard('sanctum')->check() ? 'TRUE' : 'FALSE';
        Log::info("ItemController@index: Is Request User Present?: " . ($user ? 'TRUE (ID: ' . $user->id . ')' : 'FALSE') . ", Is Auth Facade User Present?: " . ($authFacadeUser ? 'TRUE (ID: ' . $authFacadeUser->id . ')' : 'FALSE') . ", SanctumCheck: {$authCheckSanctum}");
        // ★★★ 認証状態の取得ここまで ★★★


        if ($tab === 'mylist') {
            // 'mylist'タブの場合、いいねした商品を取得
            
            // ★★★ 認証チェックは $user が必須 ★★★
            if (!$user) {
                $items = collect([]);
                Log::info("ItemController@index: Not authenticated. Returning empty mylist.");
            } else {
                // 1. ユーザーがいいねしたItemのIDを取得
                $likedItemIds = Good::where('user_id', $user->id)->pluck('item_id');

                // 2. そのItem IDを持つ商品を取得し、コメント数といいね数をカウント
                $query = Item::whereIn('id', $likedItemIds)
                    ->withCount(['comments', 'goods']);

                // 検索キーワードでフィルタリング
                if (!empty($searchQuery)) {
                    $query->where('name', 'like', '%' . $searchQuery . '%');
                }

                Log::info("ItemController@index: MYLIST QUERY SQL: " . $query->toSql());
                Log::info("ItemController@index: MYLIST QUERY BINDINGS: " . json_encode($query->getBindings()));

                $items = $query->get();
            }

        } else {
            // 'all'タブ（またはデフォルト）の場合、全商品を取得
            $query = Item::query();

            // 💡 修正箇所: 認証済みユーザーの場合のみ、自身が出品した商品を除外するロジックを修正
            if ($user && $user->id) {
                // 認証ユーザーIDが存在する場合のみ、そのユーザーの商品を除外
                // 🚨 以前の $authId の代わりに、$user->id を直接使用し、クエリビルダに渡す
                $query->where('user_id', '!=', $user->id);
                Log::info("ItemController@index: Filter applied. Excluding items by user {$user->id}.");
            }

            // 検索キーワードがあれば、クエリをフィルタリング
            if (!empty($searchQuery)) {
                $query->where('name', 'like', '%' . $searchQuery . '%');
            }

            // SQLクエリのデバッグログを追加
            Log::info("ItemController@index: ALL ITEMS QUERY SQL: " . $query->toSql());
            Log::info("ItemController@index: ALL ITEMS QUERY BINDINGS: " . json_encode($query->getBindings()));

            // リレーションをロード
            $items = $query->withCount(['comments', 'goods'])->get();
        }

        // 取得した商品コレクションをループ処理し、表示用のデータを整形
        $items->each(function ($item) {

            // 画像パスが相対パス（storage/images/...）であると仮定し、そのまま返す
            if ($item->item_image && !Str::startsWith($item->item_image, ['http://', 'https://'])) {
                // 'storage/' が含まれていない場合は追加
                if (!Str::startsWith($item->item_image, 'storage/')) {
                    $item->item_image = 'storage/' . $item->item_image;
                }
            }

            // 商品に `remain` カラムがない場合を考慮して、強制的に追加
            if (!isset($item->remain)) {
                $item->remain = 1; // 暫定
            }
        });

        // JSONデータを返す
        return response()->json([
            'items' => $items,
            'current_tab' => $tab,
        ]);
    }






    public function item_detail_show($item_id)
    {

        // アクセサ(Itemモデム)がフルURLの生成を保証するため、複雑な処理は不要 商品が存在しない場合は404エラーを返す (findOrFailを使用)
        $item = Item::with('user')->findOrFail($item_id);

        // ★★★ 修正: 配列変換と手動URL処理のロジックを全て削除 ★★★

        // デバッグログ: アクセサ経由で取得した最終URLを確認
        if ($item->item_image) {
            Log::info("ItemController@item_detail_show: Final URL (via Accessor): " . $item->item_image);
        }

        // ----------------------------------------------------
        // お気に入り・コメントデータの取得
        // ----------------------------------------------------

        $user = auth('sanctum')->user();
        $isFavorited = false;

        // 商品IDに関連するコメントを取得 (ユーザー情報もロード)
        $comments = Comment::with('user')->where('item_id', $item->id)->get();

        // お気に入り数のカウント
        $favoritesCount = Good::where('item_id', $item->id)->count();

        // ログインユーザーのお気に入り状態をチェック
        if ($user) {
            $isFavorited = Good::where('item_id', $item->id)
                ->where('user_id', $user->id)
                ->exists();
        }

        // ----------------------------------------------------
        // レスポンス
        // ----------------------------------------------------

        return response()->json([
            'item' => $item, // ★ モデルオブジェクトをそのまま返し、アクセサにURL処理を任せる ★
            'comments' => $comments,
            'is_favorited' => $isFavorited,
            'favorites_count' => $favoritesCount,
            'userId' => $user ? $user->id : null,
            'isLoggedIn' => $user !== null,
        ]);
    }



    public function item_buy_show($item_id): JsonResponse
    {
        // 1. 認証チェック
        // 通常、このチェックはroutes/api.phpでmiddleware('auth:sanctum')などを使って行いますが、
        // コントローラ内で明示的にチェックする場合は以下のようになります。
        if (!Auth::check()) {
            // 未認証の場合、401 Unauthorizedを返す
            return response()->json([
                'message' => 'Unauthenticated. Please log in.',
                'code' => 'UNAUTHENTICATED'
            ], 401);
        }

        $user = Auth::user();

        // 2. メール認証チェック
        if (!$user->hasVerifiedEmail()) {
            // メール認証が完了していない場合、403 Forbiddenと専用コードを返す
            // フロントエンドはこのコードを見て、メール認証ページへリダイレクトします。
            return response()->json([
                'message' => 'Email address is not verified. Please verify your email.',
                'code' => 'EMAIL_UNVERIFIED'
            ], 403);
        }

        // 3. 商品の取得
        $item = Item::with(['user:id,name,user_image', 'categories:id,name', 'favorites'])->find($item_id);

        if (!$item) {
            // 商品が見つからない場合、404 Not Foundを返す
            return response()->json([
                'message' => 'Item not found.'
            ], 404);
        }

        // 4. 売り切れチェック (itemモデルに is_sold というアクセサまたはカラムがあると仮定)
        if ($item->is_sold ?? false) {
            return response()->json([
                'message' => 'This item is already sold.',
                'code' => 'ITEM_SOLD'
            ], 400); // 400 Bad Request
        }

        // 5. JSONデータの整形と返却
        // フロントエンドが必要とするデータを集約して返します
        return response()->json([
            'item' => [
                'id' => $item->id,
                'name' => $item->name,
                'price' => $item->price,
                'explain' => $item->explain,
                'item_image' => $item->item_image,
                'condition' => $item->condition,
                'brand' => $item->brand,
                'categories' => $item->categories->pluck('name'),
                // 'is_sold' => $item->is_sold ?? false, // フロント側で再度チェックできる
                'seller' => $item->user,
            ],
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                // ... 他のユーザー情報（住所など、購入に必要な情報）
            ],
            'message' => 'Purchase details retrieved successfully.'
        ], 200);
    }


    public function item_purchase_edit($item_id, $user_id): JsonResponse
    {
        // 1. 認証チェック（ミドルウェアで行うのが理想的だが、ここでは明示的に確認）
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthenticated. Please log in.',
                'code' => 'UNAUTHENTICATED'
            ], 401);
        }

        // 2. 認可チェック: URLのuser_idが認証済みユーザーのIDと一致することを確認する。
        if (Auth::id() != $user_id) {
            // 認可エラーの場合、403 Forbiddenを返す
            return response()->json([
                'message' => 'Unauthorized action. The user ID in the URL does not match the authenticated user.',
                'code' => 'UNAUTHORIZED_USER'
            ], 403);
        }

        $user = Auth::user();

        // 3. 商品の取得
        $item = Item::find($item_id);

        if (!$item) {
            // 商品が見つからない場合、404 Not Foundを返す
            return response()->json([
                'message' => 'Item not found.'
            ], 404);
        }

        // 4. JSONデータの整形と返却
        // 編集ページに必要な情報（商品サマリーとユーザーの現在の住所情報）を返します。
        return response()->json([
            'item' => [
                'id' => $item->id,
                'name' => $item->name,
                'price' => $item->price,
            ],
            'user_address' => [
                // ユーザーモデルから住所関連のフィールドを抽出して返します。
                'id' => $user->id,
                'name' => $user->name,
                'post_number' => $user->post_number, // ユーザーモデルに存在する前提
                'address' => $user->address,         // ユーザーモデルに存在する前提
                'building' => $user->building,       // ユーザーモデルに存在する前提
            ],
            'message' => 'Address edit details retrieved successfully.'
        ], 200);
    }


    public function item_sell_show(Request $request)
    {
        // 1. ユーザーがログインしているかチェック
        if (!Auth::check()) {
            return response()->json([
                'message' => '未認証です。',
            ], 401); // 401 Unauthorized
        }

        $user = Auth::user();

        // 2. メール認証が完了しているかチェック
        // 元のロジック: (Auth::check() && !Auth::user()->hasVerifiedEmail()) の場合 /login へリダイレクト
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'メール認証が完了していません。',
            ], 403); // 403 Forbidden
        }

        // 認証とメール認証が完了していれば、通常は商品の詳細リストを返す必要はないが、
        // 元のBladeではItem::all()を取得していたため、空の成功レスポンス、またはメタデータを返す。
        // 今回は単純にアクセス成功を示す。
        return response()->json([
            'message' => '出品ページへのアクセスが許可されました。',
            // 'items' => Item::all(), // 取得が必要なければコメントアウト
        ], 200);
    }


    /**
     * マイページ用のプロフィールと商品リストをJSONで返す
     * Route::get('/mypage/profile')に対応@@
     */
    public function profile_revise(Request $request)
    {
        Log::info('*** [HIT] profile_revise (GET: プロフィール取得) Controller ***');

        // 認証チェック
        if (!Auth::check()) {
            Log::warning('PROFILE_REVISE_FETCH: Auth Check FAILED');
            return response()->json(['message' => 'Unauthenticated. Token or Session missing.'], 401);
        }

        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User not found despite successful authentication.'], 401);
        }

        Log::info('PROFILE_REVISE_FETCH: Profile data fetched successfully', ['user_id' => $user->id]);

        // 取得したユーザーデータをJSON形式で返す
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at, // ← hasVerifiedEmail は、/api/mypage/profile の応答である localBackendUser に含まれる email_verified_at が存在するかで判定されるこれを追加
                // ★★★ ここに他のフィールドを追加！ ★★★
                'post_number' => $user->post_number,
                'address' => $user->address,
                'building' => $user->building,
                'user_image' => $user->user_image,
            ],
            'message' => '現在のプロフィール情報を取得しました。'
        ]);
    }



    /**
     * 認証済みのユーザーのプロフィール情報をJSONで返します。＠＠
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile_show(Request $request)
    {
        Log::info('profile_page_FINAL_AUTHORIZATION_HEADER_CHECK: ' . $request->header('Authorization'));
        // 認証チェック
        if (!Auth::check()) {
            // 認証されていない場合は 401 Unauthorized を返す
            // Sanctum/Handler.php の設定により、通常は自動的に 401 が返されますが、明示的に記述
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // 認証済みのユーザーを取得
        $user = Auth::user();

        // Nuxt側のストアが期待するデータ構造に合わせてデータを整形して返す
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            // Pinia store の User インターフェースに合わせて uid も含める
            'uid' => $user->uid ?? null,
            // 必要に応じて他のプロフィール関連データも追加可能
        ]);
    }


    /**
     * マイページに表示する出品/購入済み商品リストを取得
     * API: GET /api/mypage/items?page=sell or ?page=buy
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetch_mypage_items(Request $request)
    {
        // ★デバッグポイント 1: メソッド開始を記録 (最重要)
        Log::info('--- fetch_mypage_items method STARTING ---');

        if (!Auth::check()) {
            // ★デバッグポイント 2: 認証失敗を記録
            Log::warning('Mypage fetch FAILED: User not authenticated.');
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // ★デバッグポイント 3: 認証成功とユーザーIDを記録
        $user = Auth::user();
        Log::info("Mypage fetch SUCCESS: Authenticated User ID: {$user->id}");

        $pageType = $request->query('page', 'sell');

        $items = [];

        if ($pageType === 'sell') {
            $items = Item::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            // ★デバッグポイント 4: 取得件数を確認
            Log::info("Mypage (SELL) Item count: " . $items->count());

        } elseif ($pageType === 'buy') {
            //  購入履歴を取得し、関連する商品データを含める
            $items = OrderHistory::where('user_id', $user->id)
                ->with('item') // OrderHistoryモデルに item() リレーションがあることが前提
                ->orderBy('created_at', 'desc')
                ->get();

            Log::info("Mypage (BUY) OrderHistory count: " . $items->count());

        } else {
            return response()->json(['message' => 'Invalid page type.'], 400);
        }

        return response()->json([
            'items' => $items,
            'user_id' => $user->id,
        ]);
    }

    // ItemController.php 内の修正（例: メソッド名を getUserProfile に変更）
    public function getUserProfile(Request $request)
    {
        // ★ 修正: Auth::user() の代わりに、Firebaseミドルウェアが挿入したユーザー情報を取得
        // ここでは、ミドルウェアが 'user' または 'firebaseUser' をリクエストにセットしていると仮定
        $user = $request->user(); // Laravelの標準的なミドルウェアの動作に従い、user() を使用する場合

        if (!$user) {
            // IDトークン検証失敗や、ユーザーがDBに存在しない場合の応答
            return response()->json(['message' => 'User not authenticated or not found in database.'], 404);
        }

        // Nuxt.jsが利用するユーザー情報をJSONで返す
        return response()->json([
            'user' => $user
        ]);
    }


    //onetime'へのアクセスを処理し、認証状態に応じてリダイレクトする

    public function handleOnetimeRedirect(): RedirectResponse
    {
        if (Auth::check()) {
            $user = Auth::user();

            // メール認証が完了しているか確認
            if ($user->hasVerifiedEmail()) {
                // メール認証済みの場合、'front_page'ルートへリダイレクト
                return redirect()->route('front_page');
            }

            // ユーザーは認証済みだが、メールが未認証の場合
            // Fortifyの認証メール再送信ページへリダイレクト
            return redirect()->route('verification.notice');
        }

        // ユーザーが未認証の場合、Fortifyのログインページへリダイレクト
        return redirect()->route('login');
    }



    // ユーザー情報の更新。画像アップロードの処理

    // ItemController.php 内の修正＠＠
    public function profile_update(ProfileRequest $request)
    {
        Log::info('*** [HIT] profile_update (PATCH: プロフィール更新) Controller ***');

        // 認証済みユーザーを取得
        $user = $request->user();

        if (!$user) {
            Log::warning('PROFILE_UPDATE: Auth Check FAILED');
            return response()->json(['message' => 'Authentication required.'], 401);
        }

        // name, post_number, address, building のみを取得
        $updateData = $request->only('name', 'post_number', 'address', 'building');

        // データベースを更新
        $user->update($updateData);

        // ★★★ 修正点1: 更新後の最新ユーザー情報を取得して返す ★★★
        // フロントエンドの Pinia Store の user オブジェクトを直接更新できるようにするため
        $latestUser = User::find($user->id);

        Log::info('PROFILE_UPDATE: Profile updated successfully', ['user_id' => $user->id]);

        // JSONで成功レスポンスを返す
        return response()->json([
            'success' => true,
            'message' => 'プロフィールを更新しました。',
            'user' => [
                'id' => $latestUser->id,
                'name' => $latestUser->name,
                'email' => $latestUser->email,
                'uid' => $latestUser->uid, // Firebase UIDも返却
                'email_verified_at' => $latestUser->email_verified_at,
                'post_number' => $latestUser->post_number,
                'address' => $latestUser->address,
                'building' => $latestUser->building,
                'user_image' => $latestUser->user_image,
            ]
        ], 200);
    }

    /**
     * 購入時の配送先住所を更新する（リダイレクトをJSONレスポンスに変更）
     *
     * @param AddressRequest $request
     * @param int $itemId
     * @param int $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(AddressRequest $request, $itemId, $userId)
    {
        Log::info('*** [HIT] update (住所更新) Controller ***');

        // 認証済みユーザーを取得（ここではURLの$userIdを使用せず、Auth::id()との一致を確認すべきだが、既存ロジックを尊重）
        // 既存ロジック: $userIdのユーザーを探す
        $user = User::find($userId);

        if (!$user) {
            Log::warning("ADDRESS_UPDATE: User ID $userId not found");
            return response()->json(['message' => 'ユーザーが見つかりません。'], 404);
        }

        // ★ 修正点: ログインユーザーと更新対象ユーザーが一致するか確認するロジックを追加すべき
        if (Auth::id() != $user->id) {
            Log::error("ADDRESS_UPDATE: Unauthorized attempt to update user ID $userId by Auth user " . Auth::id());
            return response()->json(['message' => '更新権限がありません。'], 403);
        }

        // リクエストから新しい住所情報を取得してユーザーを更新します。
        $user->update([
            'post_number' => $request->post_number,
            'address' => $request->address,
            'building' => $request->building,
        ]);

        // ★★★ 修正点2: リダイレクトを削除し、JSONで成功レスポンスを返す ★★★
        // フロントエンドはこれを受け取った後、自身で遷移する
        Log::info('ADDRESS_UPDATE: Address updated successfully', ['user_id' => $user->id, 'item_id' => $itemId]);

        // 更新後の最新ユーザー情報を返すことで、Pinia Store を最新の状態に保つ
        return response()->json([
            'success' => true,
            'message' => '住所を更新しました。',
            'redirect_item_id' => $itemId,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'uid' => $user->uid,
                'email_verified_at' => $user->email_verified_at,
                'post_number' => $user->post_number,
                'address' => $user->address,
                'building' => $user->building,
                'user_image' => $user->user_image,
            ]
        ], 200);
    }

    /**
     * ユーザー画像（アバター）をアップロードする＠＠
     *
     * @param ProfileImageRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user_image_upload(ProfileImageRequest $request)
    {
        Log::info('*** [HIT] user_image_upload (画像アップロード) Controller ***');

        // 認証済みユーザーを取得
        $user = $request->user();

        if (!$user) {
            Log::warning('IMAGE_UPLOAD: Auth Check FAILED');
            return response()->json(['message' => 'Authentication required.'], 401);
        }

        if ($request->hasFile('user_image') && $request->file('user_image')->isValid()) {

            // ファイル名生成と保存のロジック
            $extension = $request->user_image->getClientOriginalExtension();
            $randomName = 'user_image_' . Str::random(30) . '.' . $extension;
            // storage/app/public/user_images に保存
            $path = $request->user_image->storeAs('public/user_images', $randomName);
            $dbPath = str_replace('public/', '', $path);
            // storage/user_images/filename.ext の形式でDBに保存
            $storagePath = 'storage/' . $dbPath;

            // DBアップデート処理
            $user->update([
                'user_image' => $storagePath
            ]);

            // ★★★ 修正点3: 最新のユーザー情報と画像パスをJSONで返す ★★★
            $latestUser = User::find($user->id);

            Log::info('IMAGE_UPLOAD: Image uploaded and profile updated successfully', ['user_id' => $user->id, 'path' => $storagePath]);

            return response()->json([
                'success' => true,
                'message' => 'ユーザーイメージをアップロードしました。',
                'user' => [
                    'id' => $latestUser->id,
                    'name' => $latestUser->name,
                    'email' => $latestUser->email,
                    'uid' => $latestUser->uid,
                    'email_verified_at' => $latestUser->email_verified_at,
                    'post_number' => $latestUser->post_number,
                    'address' => $latestUser->address,
                    'building' => $latestUser->building,
                    'user_image' => $latestUser->user_image,
                ]
            ], 200);
        }

        // 画像ファイルがない場合のエラー処理
        Log::error('IMAGE_UPLOAD: No valid image file provided.');
        return response()->json([
            'success' => false,
            'message' => '画像ファイルが有効ではありません。'
        ], 400);
    }




    // 購入商品(コンビニ支払い、カード支払い)
    // コンビニ決済完了処理
    public function thanks_buy_create(PurchaseRequest $request)
    {
        // ★ 共通の認証チェックを先頭に移動
        $user = Auth::user();

        if (!$user) {
            Log::error('!!!!!Purchase failed: User not authenticated.');
            return response()->json([
                'status' => 'error',
                'message' => 'ユーザー認証が必要です。リロードしてログインを確認してください。',
            ], 401);
        }

        // 認証ユーザーIDを変数に格納
        $currentUserId = $user->id;

        // ★★★ 暫定的なバリデーションを挿入 (PurchaseRequest が不明なため) ★★★
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'address' => 'required|string',
            'payment' => 'required|string|in:コンビニ払い,カード支払い'
        ]);
        // ★★★ ここまで ★★★

        $item = Item::find($request->item_id);

        if ($request->input('payment') === 'コンビニ払い') {

            // コンビニ払いのロジック (変更なし)

            $buyAddress = "{$user->name}\n{$user->post_number}\n{$user->address}\n{$user->building}";

            OrderHistory::create([
                'user_id' => $currentUserId, // 認証ユーザーIDを使用
                'item_id' => $item->id,
                'status' => '購入済み',
                'buy_address' => $buyAddress,
                'payment' => 'コンビニ払い'
            ]);

            Log::info("!!!!!!Purchase process started for item ID: {$item->id}");

            $item->decrement('remain');

            Log::info("!!!!!!!Purchase complete. Remaining stock: {$item->remain}");

            return response()->json([
                'status' => 'success',
                'redirect_type' => 'conbini_thanks', // 遷移先のタイプを特定
                'message' => 'コンビニ払込用紙の処理方法はただいま勉強中です。<br>実装完了までしばらくお待ちください。'
            ], 200); // ステータスコード200 (OK)を返す


        } elseif ($request->input('payment') === 'カード支払い') {

            // ★★★ URL設定の一時的な上書きロジック (ポート問題解決のために維持) ★★★
            $appUrl = env('APP_URL');
            if ($appUrl) {
                $url = parse_url($appUrl);

                // 1. HTTPSを強制 (Docker環境でNginxがHTTPSを終端している場合など)
                URL::forceScheme('https');

                // 2. ホストとポートを強制 (route()がポートを無視する問題を解決)
                if (isset($url['host'])) {
                    $host = $url['host'] . (isset($url['port']) ? ':' . $url['port'] : '');
                    URL::forceRootUrl("{$url['scheme']}://{$host}");
                }

                Log::info("URL configuration temporarily forced for Stripe success URL generation.");
            }
            // ★★★ URL設定の一時的な上書きロジックここまで ★★★

            // ★★★ 修正された success_url の生成 ★★★
            // APP_URLをベースに、Stripeのプレースホルダを文字列結合で厳密に渡す
            $successUrl = $appUrl . '/api/stripe_success?session_id={CHECKOUT_SESSION_ID}';

            Stripe::setApiKey(env('STRIPE_SECRET'));
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'jpy',
                        'product_data' => [
                            'name' => $item->name,
                        ],
                        'unit_amount' => $item->price,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                // ユーザーIDをStripeセッションに紐付ける
                'client_reference_id' => (string) $currentUserId,

                // ★★★ route()ヘルパーを使わず、直接URLを渡す ★★★
                'success_url' => $successUrl,

                'cancel_url' => route('item_buy', ['item_id' => $item->id]),
            ]);

            Log::info("Stripe session created with client_reference_id: {$currentUserId}");

            return response()->json([
                'status' => 'success',
                'redirect_type' => 'stripe_checkout', // 遷移先のタイプを特定
                'stripe_url' => $session->url // StripeのチェックアウトURL
            ], 200); // ステータスコード200 (OK)を返す
        }
    }

    /**
     * Stripe決済成功時の処理
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function stripeSuccess(Request $request)
    {
        // 1. リクエストからセッションIDを取得
        $sessionId = $request->get('session_id');

        // 🚨 セッションIDがない場合は処理を中断
        if (!$sessionId || $sessionId === '{CHECKOUT_SESSION_ID}') {
            Log::error('Stripe Success failed: Missing or invalid session_id in request. Redirect from Stripe failed.', [
                'received_session_id' => $sessionId,
                'request_all' => $request->all()
            ]);
            $nuxtHost = env('NUXT_HOST', 'https://laravel.test:4431');
            return redirect("{$nuxtHost}/?error=invalid_stripe_session");
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            // StripeClientを初期化
            $stripe = new StripeClient(env('STRIPE_SECRET'));

            // 2. Stripe APIを使ってセッション情報を取得
            $session = $stripe->checkout->sessions->retrieve($sessionId, [
                'expand' => ['line_items']
            ]);

            // 3. client_reference_id（ユーザーID）とその他の情報を取得
            $userId = (int) $session->client_reference_id;

            // 🚨 ユーザーIDがない、または不正な場合は処理を中断
            if (!$userId) {
                Log::error('Stripe Success failed: Missing client_reference_id.', ['session_id' => $sessionId]);
                $nuxtHost = env('NUXT_HOST', 'https://laravel.test:4431');
                return redirect("{$nuxtHost}/?error=no_user_reference");
            }

            // 4. 認証の再確立 (Auth::user()が使えるようにする)
            $user = \App\Models\User::find($userId); // ユーザーモデルをApp\Models\Userと仮定
            if (!$user) {
                Log::error('Stripe Success failed: User not found based on client_reference_id.', ['user_id' => $userId]);
                $nuxtHost = env('NUXT_HOST', 'https://laravel.test:4431');
                return redirect("{$nuxtHost}/?error=user_not_exist");
            }

            // このリクエストのみで認証状態を復元
            Auth::login($user);

            // 💡 ここから元の購入処理ロジック 💡

            // line_itemsから商品名を取得
            $itemName = $session->line_items->data[0]->description ?? '';
            $item = Item::where('name', $itemName)->first();

            // 暫定的に、ユーザーの登録情報を利用します。
            $buyAddress = "{$user->name}\n{$user->post_number}\n{$user->address}\n{$user->building}";

            if (!$item) {
                Log::error('Stripe Success failed: Item not found based on Stripe session name.', ['item_name' => $itemName]);
                $nuxtHost = env('NUXT_HOST', 'https://laravel.test:4431');
                return redirect("{$nuxtHost}/?error=item_not_found");
            }

            // OrderHistoryの作成
            OrderHistory::create([
                'user_id' => $userId,
                'item_id' => $item->id,
                'buy_address' => $buyAddress,
                'payment' => 'カード支払い'
            ]);

            // 在庫減少
            $item->decrement('remain');

            Log::info('Stripe Success completed. Order saved to DB.', ['user_id' => $userId, 'item_id' => $item->id]);

            // Nuxtのthanksページへリダイレクト
            $nuxtHost = env('NUXT_HOST', 'https://laravel.test:4431');
            // return redirect("{$nuxtHost}/thanks?status=success&payment=card");
            return redirect("{$nuxtHost}/thanks/buy-stripe");

        } catch (\Exception $e) {
            Log::error('Stripe Success API or Logic Error: ' . $e->getMessage(), ['session_id' => $sessionId]);
            $nuxtHost = env('NUXT_HOST', 'https://laravel.test:4431');
            return redirect("{$nuxtHost}/?error=stripe_api_failed");
        }
    }



    // 出品商品登録処理

    public function thanks_sell_create(ExhibitionRequest $request)
    {
        // ExhibitionRequestで基本的なバリデーションと認証は処理されているはず
        if (!Auth::check()) {
            return response()->json(['message' => '認証が必要です。'], 401);
        }

        $itemData = $request->only([
            'name',
            'price',
            'brand',
            'explain',
            'condition',
            'item_image',
        ]);

        // カテゴリーデータを明示的に取得し、JSON形式に変換 (DB保存の元のロジックを再現)
        $selectedCategories = $request->input('category');
        // $selectedCategoriesは配列として期待されるため、LaravelのDBロジックに合わせてJSON文字列にエンコード
        $itemData['category'] = json_encode($selectedCategories);

        // ログインユーザーIDとremainを付与
        $itemData['user_id'] = auth()->id();
        $itemData['remain'] = 1;

        // データベースに商品を保存
        try {
            $item = Item::create($itemData);
        } catch (\Exception $e) {
            // DB保存失敗時のエラーハンドリング
            return response()->json([
                'message' => '商品の登録に失敗しました。',
                'error' => $e->getMessage()
            ], 500);
        }

        // 成功時は、サンクスページ表示のための成功レスポンスを返却
        return response()->json([
            'message' => '商品が正常に出品されました。',
            'item_id' => $item->id,
        ], 201); // 201 Created
    }

    // 出品商品画像アップロード処理
    public function item_image_upload(Request $request)
    {
        // リクエストの全データをログに出力 (必ず配列を渡す)
        \Log::info('画像アップロードリクエスト受信', $request->all());

        // ファイルの存在を確認しながらログに出力
        $file = $request->file('item_image');
        if ($file) {
            \Log::info('ファイル受信成功', ['filename' => $file->getClientOriginalName(), 'size' => $file->getSize()]);
        } else {
            // null の場合は、メッセージとしてログに出力
            \Log::warning('ファイルが見つかりません (null)', $request->all());
        }


        // 認証チェック (Middlewareで処理することを推奨しますが、明示的に記述)
        if (!Auth::check()) {
            return response()->json(['message' => '認証が必要です。'], 401);
        }

        $rules = [
            'item_image' => 'required|file|mimes:jpeg,png|max:2048', // maxサイズを追加推奨
        ];

        $messages = [
            'item_image.required' => '商品画像ファイルをアップロードしてください。',
            'item_image.mimes' => '商品画像ファイルは.jpegまたは.png形式でアップロードしてください。',
            // 'item_image.max' => 'ファイルサイズは2MB以内にしてください。',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            // バリデーション失敗時は422 Unprocessable Entityを返し、エラー詳細を含める
            return response()->json([
                'message' => 'バリデーションエラー',
                'errors' => $validator->errors(),
            ], 422);
        }

        // ファイル保存のロジックに進める前に、デバッグログを追記！
        \Log::info('✅ 認証チェックをスキップし、ファイル保存ロジックへ。');

        // ファイル名にランダムな文字列を付与
        $file = $request->file('item_image');

        // --- 💡 ここにデバッグログを追加 ---
        if (!$file) {
            \Log::error('❌ ファイルが Null です。致命的なリクエスト失敗。');
            return response()->json(['message' => 'ファイルがリクエストに含まれていません。'], 400);
        }
        \Log::info('✅ ファイルオブジェクトの存在を確認。');

        $extension = $file->getClientOriginalExtension();

        \Log::info('✅ 拡張子の取得に成功。'); // 💡 この行が記録されるか確認！

        $randomName = 'item_image_' . Str::random(30) . '.' . $extension;
        \Log::info('✅ ランダムファイル名の生成に成功。'); // 💡 追加のログ

        // 画像を保存 (storage/app/public/item_images に保存される)
        $path = $file->storeAs('public/item_images', $randomName);
        \Log::info('✅ ファイル保存の実行に成功。'); // 💡 追加のログ

        $dbPath = str_replace('public/', 'storage/', $path); // URL/DB保存用パス (例: storage/item_images/...)

        // 成功時は、フロントエンドで利用する保存パスをJSONで返却
        return response()->json([
            'message' => '商品画像アップロードできました！',
            'image_path' => $dbPath,
        ], 201); // 201 Created
    }


    // いいね・コメント機能関係

    public function apiFavorite(Request $request, Item $item)
    {
        // 💡 auth:sanctumミドルウェアにより、認証済みユーザーが取得できている
        $user = $request->user();

        if (!$user) {
            // auth:sanctumが失敗した場合に備えておくが、通常はミドルウェアで401が返る
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $isFavorited = false;
        $existingGood = Good::where('item_id', $item->id)->where('user_id', $user->id)->first();

        if ($existingGood) {
            // 既にいいねしている場合は、いいねを削除
            $existingGood->delete();
            $isFavorited = false;
        } else {
            // いいねしていない場合は、新しく作成
            Good::create(['item_id' => $item->id, 'user_id' => $user->id]);
            $isFavorited = true;
        }

        // 💡 成功したJSONレスポンスを返す
        $favoritesCount = Good::where('item_id', $item->id)->count();

        return response()->json([
            'message' => $isFavorited ? 'Liked' : 'Unliked',
            'is_favorited' => $isFavorited, // 現在の状態
            'favorites_count' => $favoritesCount, // 最新のいいね数
        ]);
    }


    public function comment_create(CommentRequest $request)
    {
        // auth()ヘルパーはAPIトークン認証（Sanctumガード）の場合、
        // ユーザーが認証されていればそのユーザーを返します。
        $userId = auth('sanctum')->id(); // 認証済みのユーザーIDをSanctumガードで取得

        if (!$userId) {
            // ユーザーが認証されていない場合はエラーを返す
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $comment = $request->input('comment');
        $itemId = $request->input('item_id');

        $word = [
            'comment' => $comment,
            'user_id' => $userId,
            'item_id' => $itemId,
        ];

        // データベースにコメントを作成
        $newComment = Comment::create($word);

        // 💡 修正: APIリクエストなので、リダイレクトではなくJSONレスポンスを返す
        // ステータスコード201 (Created) と作成されたコメントのデータを返すと、
        // Nuxt側でコメントリストを更新しやすくなります。

        // コメントユーザー情報をロードしてクライアントに返す
        $newComment->load('user');

        return response()->json([
            'message' => 'コメントが正常に投稿されました。',
            'comment' => $newComment, // クライアントがリアルタイム更新に利用可能
        ], 201);
    }
}
