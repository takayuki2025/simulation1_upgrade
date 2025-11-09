<script setup lang="ts">
// I. 依存関係
import { ref } from 'vue'; // Vueの基本機能
import { useRouter } from 'vue-router'; // ルーティング機能
import { useAuthStore } from '@/stores/auth'; // 認証ストア
import { storeToRefs } from 'pinia'; // Piniaストア状態の展開
import { useApi } from '~/composables/useApi'; // 認証付きAPI通信クライアント

// II. 型定義
interface ItemForm {
  item_image: string | null; // DB保存パス ('storage/item_images/...')
  category: string[];
  condition: string | null;
  name: string | null;
  brand: string | null;
  explain: string | null;
  price: number | null;
}

// III. 初期化
const router = useRouter();
const authStore = useAuthStore();
const { isAuthenticated, hasVerifiedEmail } = storeToRefs(authStore); // メール認証状態も利用
const { authenticatedFetch } = useApi();

// UIフィードバックのための状態Ref
const isSubmitting = ref(false);
const isImageUploading = ref(false);
const serverErrors = ref<{ [key: string]: string | string[] }>({});
const successMessage = ref('');
const errorMessage = ref('');

// フォームRef
const form = ref<ItemForm>({
  item_image: null,
  category: [],
  condition: null,
  name: null,
  brand: null,
  explain: null,
  price: null,
});

// カテゴリーリストと状態リスト
const categories = [
    'ファッション', '家電', 'インテリア', 'レディース', 'メンズ',
    'コスメ', '本', 'ゲーム', 'スポーツ', 'キッチン',
    'ハンドメイド', 'アクセサリー', 'おもちゃ', 'キッズ:ベビー'
];
const conditions = ['良好', '目立った傷や汚れなし', 'やや傷や汚れあり', '状態が悪い'];

// IV. ロジック

/**
 * ページアクセス時の認証チェック
 * コントローラーロジック (Auth::check() && !Auth::user()->hasVerifiedEmail()) を再現
 */
const checkAuthentication = async () => {
    isLoading.value = true;
    try {
        await authStore.waitForAuthResolution();
        
        // ログインしていない、またはメール認証が完了していない場合、リダイレクト
        if (!isAuthenticated.value || !hasVerifiedEmail.value) {
            errorMessage.value = 'メール認証が完了していません。ログインページへリダイレクトします。';
            setTimeout(() => router.push('/login'), 1500);
            return false;
        }
    } catch (e) {
        console.error("Auth check failed:", e);
        errorMessage.value = '認証チェック中にエラーが発生しました。';
        setTimeout(() => router.push('/login'), 1500);
        return false;
    } finally {
        isLoading.value = false;
    }
    return true;
};

// コンポーネントロード時に認証チェックを実行
const isLoading = ref(true);
checkAuthentication();


/**
 * 画像選択・アップロード処理 (Route::post('/upload', ...)) を再現
 */
const handleImageUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    
    isImageUploading.value = true;
    serverErrors.value.item_image = undefined; // 画像関連のエラーをクリア
    successMessage.value = '';
    errorMessage.value = '';

    try {
        const formData = new FormData();
        formData.append('item_image', file);

        // 1. APIコール (item_image_uploadロジックの再現)
        const response: any = await authenticatedFetch('/upload', {
            method: 'POST',
            body: formData, // FormDataを直接送信
            contentType: 'multipart/form-data', // ヘッダーを自動設定させる
        });

        // 2. 成功時の処理 (パスとメッセージの取得)
        // サーバーから返されるデータ構造に合わせる必要がありますが、ここではシミュレーションとして
        // サーバーがセッションではなくJSONでパスを返すものと仮定します。
        
        // 💡 サーバーの応答をセッションからJSONへ変更推奨ですが、元の処理を再現するため、
        // サーバーが成功時にパスをJSONで返すことを想定します。
        
        // 仮の成功シミュレーション (サーバー応答からパスを取得)
        // 実際はLaravel側でJSON応答に変更が必要です。
        const uploadedPath = response.image_path || 'storage/item_images/temp_uploaded_' + file.name;
        
        form.value.item_image = uploadedPath;
        successMessage.value = '商品画像アップロードできました！';
        
    } catch (error: any) {
        console.error('画像アップロードエラー:', error);
        
        const statusCode = error.status || (error.response ? error.response.status : '不明');
        
        if (statusCode === 422) {
             // 422: Laravelからのバリデーションエラーを処理
            serverErrors.value.item_image = error.response?._data?.errors?.item_image || '画像ファイルが無効です。';
        } else {
            errorMessage.value = error.message || `画像アップロード中に予期せぬエラーが発生しました (Status: ${statusCode})。`;
        }
        
    } finally {
        isImageUploading.value = false;
        // ファイルインプットをリセットして同じファイルを再度選択できるようにする
        if (input) input.value = '';
    }
};

/**
 * フォームの送信処理 (Route::post('/items', ...)) を再現
 */
const submitNewData = async () => {
    if (isSubmitting.value || !form.value.item_image) return; // 画像がない場合は送信不可

    isSubmitting.value = true;
    serverErrors.value = {};
    successMessage.value = '';
    errorMessage.value = '';

    // カテゴリーのバリデーションをフロントで仮チェック
    if (form.value.category.length === 0) {
        serverErrors.value.category = 'カテゴリーを一つ以上選択してください。';
        isSubmitting.value = false;
        return;
    }

    try {
        // 1. 認証チェック
        if (!(await checkAuthentication())) return;
        
        // 2. APIコール (thanks_sell_createロジックの再現)
        const response: any = await authenticatedFetch('/items', { // Laravel側のエンドポイントに合わせて'/items'を使用
            method: 'POST',
            body: {
                ...form.value,
                price: form.value.price ? Number(form.value.price) : null,
                // カテゴリーはバックエンドでJSONエンコードされるため、配列のまま送信
            },
        });

        console.log('[DEBUG: ItemSell] API Response:', response);

        // 成功: データベース保存成功後、サンクスページへリダイレクト
        successMessage.value = '商品を出品し、サンクスページへ移動します。';

        setTimeout(() => {
            router.push('/thanks_sell'); // thanks_sellビューに相当するルートへ遷移
        }, 1500);

    } catch (error: any) {
        console.error('出品エラー:', error);
        
        const statusCode = error.status || (error.response ? error.response.status : '不明');
        
        if (statusCode === 422) {
            // 422: Laravelからのバリデーションエラーを処理
            serverErrors.value = error.response?._data?.errors || {};
            errorMessage.value = '入力内容に誤りがあります。ご確認ください。';
        } else {
            errorMessage.value = error.message || `出品中に予期せぬエラーが発生しました (Status: ${statusCode})。`;
        }
        
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div v-if="isLoading" class="loading-overlay">
        認証状態を確認中です...
    </div>
    
    <div v-else-if="!isAuthenticated || !hasVerifiedEmail" class="error-message">
        {{ errorMessage || 'アクセス権限がありません。ログインページへリダイレクト中です。' }}
    </div>

    <div v-else class="item_sell_contents">
        <div class="item_sell_contents_box">
            <div class="small_box">

                <h1 class="item_sell_contents_box_title">商品の出品</h1>

                <!-- エラー/成功メッセージ表示エリア -->
                <div v-if="successMessage" class="alert-success">
                    {{ successMessage }}
                </div>
                <div v-else-if="errorMessage" class="alert_error">
                    {{ errorMessage }}
                </div>

                <!-- 商品画像フォーム -->
                <label class="item_sell_contents_box_imagetitle">商品画像</label>
                <div class="item_sell_contents_box_line">
                    
                    <button 
                        type="button" 
                        class="upload_submit" 
                        :disabled="isImageUploading"
                        @click="() => {
                            const fileInput = $refs.fileInput as HTMLInputElement;
                            if (fileInput) fileInput.click();
                        }"
                    >
                        {{ isImageUploading ? 'アップロード中...' : '画像を選択する' }}
                    </button>
                    <!-- ファイル選択インプット (非表示) -->
                    <input 
                        type="file" 
                        ref="fileInput" 
                        @change="handleImageUpload" 
                        style="display: none;" 
                        accept="image/jpeg, image/png"
                    >
                    
                    <!-- 画像アップロードエラー表示 -->
                    <div v-if="serverErrors.item_image" class="alert_error">
                        {{ Array.isArray(serverErrors.item_image) ? serverErrors.item_image[0] : serverErrors.item_image }}
                    </div>
                    
                    <div v-if="form.item_image" class="image-preview-area">
                        <p>✅ 画像が選択されました。</p>
                        <!-- ここに画像プレビューを表示する処理を追加可能 -->
                    </div>
                </div>

                <div class="sell_title1">
                    <h2>商品の詳細</h2>
                </div>

                <!-- メイン出品フォーム -->
                <form @submit.prevent="submitNewData">
                    
                    <div class="sell_title1_1">
                        <label>カテゴリー</label>
                        <br><br>
                        <div class="category-buttons-container">
                            <template v-for="(cat, index) in categories" :key="index">
                                <input 
                                    type="checkbox" 
                                    :id="`cat${index + 1}`" 
                                    :value="cat" 
                                    class="category-checkbox-input"
                                    v-model="form.category"
                                >
                                <label :for="`cat${index + 1}`" class="category-checkbox-label">{{ cat }}</label>
                            </template>
                        </div>
                        <div v-if="serverErrors.category" class="error">
                             {{ Array.isArray(serverErrors.category) ? serverErrors.category[0] : serverErrors.category }}
                        </div>
                        <br>
                    </div>

                    <div class="sell_title1_2">
                        <label>商品の状態</label>
                        <select class="select_box" v-model="form.condition">
                            <option :value="null" disabled>選択してください</option>
                            <option v-for="(cond, index) in conditions" :key="index" :value="cond">{{ cond }}</option>
                        </select>
                        <div v-if="serverErrors.condition" class="error">
                            {{ Array.isArray(serverErrors.condition) ? serverErrors.condition[0] : serverErrors.condition }}
                        </div>
                    </div>

                    <div class="sell_title2">
                        <h2>商品名と説明</h2>
                    </div>

                    <div class="sell_title2_1">
                        <label>商品名</label>
                        <input type="text" class="sell_item_form" v-model="form.name">
                        <div v-if="serverErrors.name" class="error">
                             {{ Array.isArray(serverErrors.name) ? serverErrors.name[0] : serverErrors.name }}
                        </div>
                    </div>

                    <div class="sell_title2_2">
                        <label>ブランド名</label>
                        <input type="text" class="sell_item_form" v-model="form.brand">
                         <div v-if="serverErrors.brand" class="error">
                            {{ Array.isArray(serverErrors.brand) ? serverErrors.brand[0] : serverErrors.brand }}
                        </div>
                    </div>

                    <div class="sell_title2_3">
                        <label>商品の説明</label>
                        <textarea class="sell_item_form_textarea" v-model="form.explain"></textarea>
                        <div v-if="serverErrors.explain" class="error">
                             {{ Array.isArray(serverErrors.explain) ? serverErrors.explain[0] : serverErrors.explain }}
                        </div>
                    </div>

                    <div class="sell_title2_4">
                        <label>販売価格</label>
                        <input type="text" class="sell_item_form2" v-model.number="form.price" inputmode="numeric">
                        <span class="currency-symbol">¥</span>
                        <div v-if="serverErrors.price" class="error">
                            {{ Array.isArray(serverErrors.price) ? serverErrors.price[0] : serverErrors.price }}
                        </div>
                    </div>

                    <div class="sell_title3">
                        <!-- item_imageはv-modelのformに含まれているため、hidden inputは不要 -->
                        <button type="submit" class="sell_item_submit" :disabled="isSubmitting || !form.item_image">
                            {{ isSubmitting ? '出品処理中...' : '出品する' }}
                        </button>
                        <div v-if="!form.item_image && !isImageUploading" class="error mt-3">
                            <br>商品画像をアップロードしてください。
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* ==============================================================
   元のCSSを忠実に再現 (99%デザイン再現のため、固定値と相対配置を維持)
   ============================================================== */

/* Loading State */
.loading-overlay, .error-message {
    text-align: center;
    padding: 50px;
    font-size: 1.2rem;
    color: #5f5f5f;
}

/* Font/Base Styles */
label {
    font-weight: bold;
}

/* Layout Container */
.item_sell_contents {
    display: flex;
    text-align: center;
    justify-content: center;
    margin: 0 auto;
    max-width: 1400px;
}

.item_sell_contents_box {
    display: flex;
    height: 1500px; /* 高さを固定 */
    width: 600px; /* 幅を固定 */
    text-align: center;
    justify-content: center;
}

.small_box {
    width: 100%;
    text-align: center;
    justify-content: center;
}

.item_sell_contents_box_title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
}

/* --- Image Upload Section --- */
.item_sell_contents_box_imagetitle {
    position: relative;
    right: 260px; /* 固定オフセット */
}

.item_sell_contents_box_line {
    border: 1px dotted black;
    height: 100px;
    padding-top: 5px; 
}

.upload_submit {
    position: relative;
    top: 35px;
    color: #ff5655;
    font-weight: bold;
    border: 2px solid #ff5655;
    background-color: white;
    height: 35px;
    border-radius: 5px;
    padding: 0 15px;
    cursor: pointer;
}

.upload_submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.image-preview-area {
    position: relative;
    top: 40px;
    color: #799d90;
    font-weight: bold;
    font-size: 14px;
}


/* --- 商品の詳細 (カテゴリ・状態) --- */
.sell_title1  {
    margin-top: 30px;
    border-bottom: 1px solid #5f5f5f;
    color: #5f5f5f;
    padding-bottom: 5px;
}

.sell_title1 h2 {
    position: relative;
    right: 240px; /* 固定オフセット */
    font-size: 18px;
}

.sell_title1_1 {
    margin-top: 30px;
    position: relative;
}
.sell_title1_1 label {
    position: relative;
    right: 250px; /* 固定オフセット */
}

.category-buttons-container {
    position: relative;
    left: 260px; /* 固定オフセット */
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start; 
    align-items: center;
    width: 100%; 
    max-width: 600px;
}

/* カテゴリーボタンのスタイル */
.category-checkbox-input {
    display: none;
}

.category-checkbox-label {
    /* スタイルの固定値維持 */
    height: 8px; 
    font-size: 9px;
    margin: 5px;
    display: inline-block;
    padding: 8px 16px;
    border: 2px solid #ff5655;
    color: #ff5655;
    border-radius: 9999px;
    cursor: pointer;
    background-color: white;
    transition: background-color 0.2s, border-color 0.2s;
    line-height: 8px;
    white-space: nowrap;
}

.category-checkbox-input:checked+.category-checkbox-label {
    background-color: #ff5655;
    color: #fff;
    border-color: #ff5655;
}

/* 商品の状態 */
.sell_title1_2 {
    margin-top: 20px;
}

.sell_title1_2 label{
    display: block;
    position: relative;
    right: 250px;
    margin-bottom: 10px;
}

.select_box {
    width: 600px;
    height: 35px; 
    border: 1px solid #ccc;
    padding: 0 5px;
}


/* --- 商品名と説明 --- */
.sell_title2 {
    margin-top: 40px;
    color: #5f5f5f;
    border-bottom: 1px solid #5f5f5f;
    padding-bottom: 5px;
}

.sell_title2 h2{
    position: relative;
    right: 230px;
    font-size: 18px;
}

/* フォームフィールド共通スタイル */
.sell_item_form, .sell_item_form2, .sell_item_form_textarea {
    width: 600px;
    border: 1px solid #ccc;
    padding: 5px;
    box-sizing: border-box;
}

.sell_item_form {
    height: 35px;
}

.sell_item_form_textarea {
    height: 130px;
    resize: none;
}

.sell_item_form2 {
    height: 35px;
    text-align: right;
    padding-right: 35px; 
}

/* 個別ラベルの位置調整 (固定オフセット維持) */
.sell_title2_1 label{
    display: block;
    margin-top: 30px;
    position: relative;
    right: 275px;
}

.sell_title2_2 label {
    display: block;
    margin-top: 30px;
    position: relative;
    right: 260px;
}

.sell_title2_3 label {
    display: block;
    margin-top: 30px;
    position: relative;
    right: 260px;
}

.sell_title2_4 label {
    display: block;
    margin-top: 30px;
    position: relative;
    right: 265px;
}

/* 販売価格の¥マーク */
.currency-symbol {
    position: relative;
    right: 280px; /* 固定オフセット */
    bottom: 35px;
    font-size: 20px;
    font-weight: 700;
}

/* --- 送信ボタン --- */
.sell_title3 {
    margin-top: 80px;
}

.sell_item_submit {
    background-color: #ff5655;
    border: 1px solid #ff5655; 
    color: white;
    font-size: 18px;
    font-weight: 800;
    border-radius: 3px;
    width: 600px; 
    height: 50px;
    cursor: pointer;
    transition: opacity 0.2s;
}
.sell_item_submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* --- メッセージ/エラー --- */
.alert-success {
    position: relative !important;
    top: 40px !important;
    color: #28a745!important;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    padding: 8px;
    border-radius: 4px;
    width: 600px;
    margin: 0 auto 50px auto; /* 下の要素との隙間調整 */
}

.alert_error {
    position: relative;
    top: 40px;
    color: red;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    padding: 8px;
    border-radius: 4px;
    width: 600px;
    margin: 0 auto 50px auto; /* 下の要素との隙間調整 */
}

.error {
    color: red;
    font-size: 14px;
    margin-top: 5px;
    text-align: left;
    width: 600px;
    margin: 0 auto;
}

/* フォーム直下の個別のエラー修正 */
.sell_title1_1 .error,
.sell_title1_2 .error,
.sell_title2_1 .error,
.sell_title2_2 .error,
.sell_title2_3 .error,
.sell_title2_4 .error {
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    width: 600px;
}

</style>