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
use Illuminate\Support\Facades\Log; // Logをインポート


class ItemController extends Controller 
{

    // フロントページを表示し、持続検索機能とタブの切り替えを処理します。
    // NuxtからのAPIリクエストに対応するため、JSONレスポンスに変更します。
    public function index(Request $request)
    {
        // URLのGETパラメータ'tab'を取得。デフォルトは'all'
        $tab = $request->query('tab', 'all');

        // URLのGETパラメータ'all_item_search'を取得
        $searchQuery = $request->query('all_item_search');

        // ★★★ 修正点: Sanctumガードを使ってユーザーを取得 ★★★
        // ルートにミドルウェアがない場合でも、リクエストヘッダーにトークンがあればユーザーを特定できます。
        $user = Auth::guard('sanctum')->user();
        $authId = $user ? $user->id : null;
        
        Log::info("ItemController@index called. AuthID (via sanctum guard): " . ($authId ?? 'N/A'));


        if ($tab === 'mylist') {
            // 'mylist'タブの場合、いいねした商品を取得
            // ここでは $user (sanctumガードで取得したもの) を使います。
            
            // 🚨 認証済みでなければマイリストは空のコレクション
            if (!$user) {
                $items = collect([]); 
            } else {
                // Goodモデルを介して関連するItemを取得
                $items = Good::where('user_id', $user->id)
                    ->withCount(['comments', 'goods']) // mylist内のItemにもカウントを追加
                    ->get()
                    ->pluck('item')
                    ->filter(); // nullをフィルタリング
            }
            
            // 検索キーワードでフィルタリング
            if (!empty($searchQuery)) {
                $items = $items->filter(function ($item) use ($searchQuery) {
                    return stripos($item->name, $searchQuery) !== false;
                })->values(); // フィルタリング後にインデックスをリセット
            }

        } else {
            // 'all'タブ（またはデフォルト）の場合、全商品を取得
            $query = Item::query();
            
            // 💡 認証済みユーザーの場合のみ、自身が出品した商品を除外する
            if ($authId) { // ★ 修正後の $authId を使用
                // 認証ユーザーIDが存在する場合のみ、そのユーザーの商品を除外
                $query->where('user_id', '!=', $authId);
                Log::info("ItemController@index: Filter applied. Excluding items by user {$authId}.");
            }
            // 🚨 Auth::id() が null の場合と同じく、where 句は実行されず全ての商品が取得される

            // 検索キーワードがあれば、クエリをフィルタリング
            if (!empty($searchQuery)) {
                $query->where('name', 'like', '%' . $searchQuery . '%');
            }
            
            // リレーションをロード
            $items = $query->withCount(['comments', 'goods'])->get();
        }

        // 取得した商品コレクションをループ処理し、表示用のデータを整形
        $items->each(function ($item) {
            
            // 画像パスが相対パス（storage/images/...）であると仮定し、そのまま返す
            // Nuxt側でASSET_BASE_URLと結合してフルURLにする
            if ($item->item_image && !Str::startsWith($item->item_image, ['http://', 'https://'])) {
                // 'storage/' が含まれていない場合は追加（二重に追加されないように注意）
                if (!Str::startsWith($item->item_image, 'storage/')) {
                    $item->item_image = 'storage/' . $item->item_image; // 例: storage/images/item_xxx.jpg
                }
            }
        });

        // 🚨 HTMLビューではなくJSONデータを返す
        return response()->json([
            'items' => $items,
            'current_tab' => $tab,
        ]);
    }


        public function item_detail_show($item_id)
    {
            $item = Item::findOrFail($item_id);

        if ($item->remain == 0) {
            $item->price = 'sold';
        }

            $item_id = $item->id;
            $comments = Comment::where('item_id',$item_id)->get();


            $user = Auth::user();
            $isFavorited = false; // デフォルト値を`false`に設定
            $favoritesCount = Good::where('item_id', $item->id)->count();

            if ($user) {
            $isFavorited = Good::where('item_id', $item->id)
            ->where('user_id', $user->id)
            ->exists();
            }
            // 商品が存在しない場合のエラー処理（推奨）
            if (!$item) {
            // 例として、404ページを表示
            abort(404);
    }
            return view('item_detail',compact('item' ,'item_id','comments', 'isFavorited','favoritesCount','user'));
    }


    public function item_buy_show($item_id)
    {
        // ←で戻るでページに移動したとしてもとしてもメール認証完了していないと購入ページには移動できないようにです。
        if (Auth::check() && !Auth::user()->hasVerifiedEmail()) {
            // 強制的にログイン画面へリダイレクト
            return redirect('/login');
        }

        $user = Auth::user();

        $item = Item::find($item_id);

        if (!$item) {
            abort(404);
        }

        return view('item_buy', [
            'item' => $item,
            'item_id' => $item->id,
            'user' => $user,
        ]);
    }


        public function item_purchase_edit($item_id,$user_id)
    {
            // URLのuser_idが認証済みユーザーのIDと一致することを確認する。
            if (Auth::id() != $user_id) {
            abort(403, 'Unauthorized action.');
            }

            $user = Auth::user();

            $item = Item::findOrFail($item_id);

        return view('address',compact('user','item_id','user_id','item'));
    }


    public function item_sell_show(Request $request)
    {
        // ←で戻るでページに移動したとしてもとしてもメール認証完了していないと購入ページには移動できないようにです。
        if (Auth::check() && !Auth::user()->hasVerifiedEmail()) {
            // ログインページへリダイレクトします
            return redirect('/login');
        }

        $items = Item::all();
        return view('item_sell', compact('items'));
    }


    /**
     * マイページ用のプロフィールと商品リストをJSONで返す
     * Route::get('/mypage/profile')に対応
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
     * 認証済みのユーザーのプロフィール情報をJSONで返します。
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile_show(Request $request)
    {
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

                                       // ItemController.php 内の修正
    public function profile_update(ProfileRequest $request)
{
    // ★ 修正: 認証済みユーザーを取得
    $user = $request->user();

    if (!$user) {
        return response()->json(['message' => 'Authentication required.'], 401);
    }

    $updateData = $request->only('name', 'post_number', 'address', 'building');
    
    // ★ user_imageの処理は画像アップロードAPIに任せるため、削除
    // 既存のLaravelコードでの $user->user_image = $request->input('user_image'); は削除
    
    $user->update($updateData);

    // ★ JSONで成功レスポンスを返す（リダイレクトを削除）
    return response()->json([
        'success' => true,
        'message' => 'プロフィールを更新しました。'
    ], 200);
}


        public function update(AddressRequest $request, $itemId, $userId)
    {
            $user = User::find($userId);

        if (!$user) {
            return redirect()->back()->with('error', 'ユーザーが見つかりません。');
        }
        // リクエストから新しい住所情報を取得してユーザーを更新します。
        // AddressRequestでバリデーション済みのため、直接アクセスします。
            $user->update([
                'post_number' => $request->post_number,
                'address' => $request->address,
                'building' => $request->building,
        ]);

        return redirect()->route('item_buy', ['item_id' => $itemId]);
    }


                                             // ItemController.php 内の修正
    public function user_image_upload(ProfileImageRequest $request)
    {
    // ★ 修正: 認証済みユーザーを取得
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Authentication required.'], 401);
        }

        if ($request->hasFile('user_image') && $request->file('user_image')->isValid()) {
        // ファイル名生成と保存のロジックは変更なし
            $extension = $request->user_image->getClientOriginalExtension();
            $randomName = 'user_image_' . Str::random(30) . '.' . $extension;
            $path = $request->user_image->storeAs('public/user_images', $randomName);
            $dbPath = str_replace('public/', '', $path);
            $storagePath = 'storage/' . $dbPath;

        // DBアップデート処理
            $user->update([
                'user_image' => $storagePath 
            ]);

        // ★ JSONで成功レスポンスを返す（リダイレクトを削除）
            return response()->json([
                'success' => true,
                'message' => 'ユーザーイメージをアップロードしました。',
            '   image_path' => $storagePath 
            ], 200);

            }
    
    // 画像ファイルがない場合のエラー処理
        return response()->json([
            'success' => false,
            'message' => '画像ファイルがありません。'
        ], 400);
    }

    


// 購入商品(コンビニ支払い、カード支払い)・出品商品の処理
        // コンビニ決済完了処理
        public function thanks_buy_create(PurchaseRequest $request)
    {
            $item = Item::find($request->item_id);

        if ($request->input('payment') === 'コンビニ払い') {

            $user = Auth::user();

            $buyAddress = "{$user->name}\n{$user->post_number}\n{$user->address}\n{$user->building}";

            OrderHistory::create([
                'user_id' => $user->id,
                'item_id' => $item->id,
                'status' => '購入済み',
                'buy_address' => $buyAddress,
                'payment' => 'コンビニ払い'
            ]);

            $item->decrement('remain');

            return redirect()->route('thanks_buy')->with('success_conbini','コンビニ払込用紙の処理方法はただいま勉強中です。<br>実装完了までしばらくお待ちください。');

        } elseif ($request->input('payment') === 'カード支払い') {

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
                'success_url' => route('stripe_success', [
                'item_id' => $item->id,
                'address' => $request->address,
                'payment' => 'カード支払い'
                ]),
                'cancel_url' => route('item_buy', ['item_id' => $item->id]),
            ]);

            return redirect($session->url, 303);
        }
    }


        // stripe決済完了処理
        public function stripeSuccess(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

            $user = Auth::user();

            $buyAddress = "{$user->name}\n{$user->post_number}\n{$user->address}\n{$user->building}";

        OrderHistory::create([
            'user_id' => Auth::id(),
            'item_id' => $request->item_id,
            'buy_address' => $buyAddress,
            'payment' => 'カード支払い'
        ]);

        $item = Item::find($request->item_id);
        $item->decrement('remain');

        return redirect()->route('thanks_buy')->with('success', 'クレジットカード購入処理完了致しました。');
    }


        // コンビニ・stripe決済完了後ページを表示する
        public function thanks_buy_show()
    {
        return view('thanks_buy');
    }

// 出品商品登録処理

        public function thanks_sell_create(ExhibitionRequest $request)
    {
        $item = $request->only([
            'name',
            'price',
            'brand',
            'explain',
            'condition',
            'item_image',
        ]);

        // カテゴリーデータを明示的に取得し、JSON形式に変換
        $selectedCategories = $request->input('category');
        $item['category'] = json_encode($selectedCategories);

        // ログインユーザーIDとremainを付与
        $item['user_id'] = auth()->id();
        $item['remain'] = 1;

        // データベースに商品を保存
        Item::create($item);

        return view('thanks_sell');
    }

        // 出品商品画像アップロード処理
        public function item_image_upload(Request $request)
    {
        $rules = [
            'item_image' => 'required|mimes:jpeg,png',
        ];

        $messages = [
            'item_image.required' => '商品画像ファイルをアップロードしてください。',
            'item_image.mimes' => '商品画像ファイルは.jpegまたは.png形式でアップロードしてください。',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // ファイル名にランダムな文字列を付与
        $extension = $request->file('item_image')->getClientOriginalExtension();
        $randomName = 'item_image_' . Str::random(30) . '.' . $extension;

        // 画像を保存
        $path = $request->item_image->storeAs('public/item_images', $randomName);
        $dbPath = str_replace('public/', '', $path);

        return redirect()->back()->with('success', '商品画像アップロードできました！')->with('image_path', 'storage/' . $dbPath);
    }


// いいね・コメント機能関係

        public function favorite(Request $request, Item $item)
    {
            $user = Auth::user();

        if (!$user) {

        return redirect()->route('login')->with('error', 'いいね機能を利用するにはログインが必要です。');
        }
            // 既にいいねしているかチェック
            $existingGood = Good::where('item_id', $item->id)
                ->where('user_id', $user->id)
                ->first();

        if ($existingGood) {
            // 既にいいねしている場合は、いいねを削除
            $existingGood->delete();
        } else {
            // いいねしていない場合は、新しく作成
            Good::create([
                'item_id' => $item->id,
                'user_id' => $user->id,
            ]);
        }
                return back();
    }


        public function comment_create(CommentRequest $request)
    {
        $comment = $request->input('comment');
        $itemId = $request->input('item_id');
        $userId = auth()->id();

        $word = [
            'comment' => $comment,
            'user_id' => $userId,
            'item_id' => $itemId,
        ];

        Comment::create($word);

        return redirect()->route('item_detail', ['item_id' => $itemId])->with('success', 'コメントが送信されました。');
    }
}
