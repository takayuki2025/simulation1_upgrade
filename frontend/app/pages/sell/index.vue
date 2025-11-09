<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // Nuxtでは useNuxtApp().$router または useRouter()
import { useAuthStore } from '@/stores/auth'; // 実際のストアパスに変更してください
import { useAuth } from '~/composables/useAuth'; // 実際のコンポーザブルパスに変更してください
import { $fetch } from 'ofetch'; // Nuxtの $fetch を使用
import { useRuntimeConfig } from '#app';

// =======================================================
// I. 依存関係の初期化と設定
// =======================================================

// 実際のNuxtランタイムコンフィグからAPIベースURLを取得
const config = useRuntimeConfig();
const API_BASE_URL = config.public.apiBaseUrl;

const router = useRouter();
const authStore = useAuthStore();
const { token: localToken } = useAuth(); // 認証トークンを取得するComposables

// Pinia Storeから必要な状態を取得
const isAuthenticated = computed(() => !!authStore.user);
const hasVerifiedEmail = computed(() => !!authStore.user?.email_verified_at);

// =======================================================
// II. 型定義と状態管理
// =======================================================

interface ItemForm {
    item_image: string | null; // アップロード後のサーバーパス
    category: string[];
    condition: string | null;
    name: string | null;
    brand: string | null;
    explain: string | null;
    price: number | null;
}

const isSubmitting = ref(false);
const isImageUploading = ref(false);
const isLoading = ref(true); // 認証チェックのためのローディング状態

// サーバーエラーの型
const serverErrors = ref<{ [key: string]: string | string[] | undefined }>({});
const successMessage = ref('');
const errorMessage = ref('');
const fileInput = ref<HTMLInputElement | null>(null); // ファイルインプットへの参照

// フォームの初期状態
const form = ref<ItemForm>({
    item_image: null,
    category: [],
    condition: null,
    name: null,
    brand: null,
    explain: null,
    price: null,
});

// 選択肢データ
const categories = [
    'ファッション', '家電', 'インテリア', 'レディース', 'メンズ',
    'コスメ', '本', 'ゲーム', 'スポーツ', 'キッチン',
    'ハンドメイド', 'アクセサリー', 'おもちゃ', 'キッズ:ベビー'
];
const conditions = ['良好', '目立った傷や汚れなし', 'やや傷や汚れあり', '状態が悪い'];

// =======================================================
// III. ロジック (認証チェック、API通信)
// =======================================================

/**
 * 認証チェックとアクセス制御
 */
const checkAuthentication = async () => {
    isLoading.value = true;
    // authStore.waitForAuthResolution() は、認証ストアがサーバーから初期ユーザー情報を取得するのを待つ関数を想定
    await authStore.waitForAuthResolution();

    if (!isAuthenticated.value || !hasVerifiedEmail.value) {
        console.log('[Auth Check] 未認証またはメール未確認。/loginへリダイレクト。');
        errorMessage.value = 'アクセス権限がありません。ログインページへリダイレクト中です。';
        setTimeout(() => router.push('/login'), 1500); // 実際のパスに合わせて修正
        return false;
    }

    isLoading.value = false;
    return true;
};

// コンポーネントロード時に認証チェックを実行
onMounted(() => {
    checkAuthentication();
});


/**
 * 認証付きAPIフェッチヘルパー
 * (汎用的なComposableを使用する場合は置き換えてください)
 */
async function authenticatedFetch(endpoint: string, options: any) {
    const token = localToken.value;
    if (!token) {
        // トークンがない場合、401エラーとして扱う
        throw { status: 401, message: '認証トークンが見つかりません。' };
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        // FormDataの場合は'Content-Type'を明示的に設定しない（ブラウザに任せる）
        ...options.headers,
    };

    try {
        const fullUrl = `${API_BASE_URL}${endpoint}`;
        const response = await $fetch(fullUrl, {
            ...options,
            headers,
        });
        return response;
    } catch (error: any) {
        // ofetchのエラー構造を考慮してエラーを投げる
        const status = error.statusCode || error.status || 500;
        const data = error.data || error.response?._data;

        if (status === 422 && data && data.errors) {
            // Laravelのバリデーションエラーを整形して投げる
            throw { status: 422, errors: data.errors };
        } else if (status === 401) {
            // 認証エラー
            throw { status: 401, message: 'セッションの有効期限が切れています。再ログインしてください。' };
        }
        // その他のエラー
        throw { status, message: error.message || '予期せぬAPIエラーが発生しました。' };
    }
}


/**
 * 画像選択・アップロード処理
 */
const handleImageUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    isImageUploading.value = true;
    serverErrors.value.item_image = undefined; // エラーをリセット
    successMessage.value = '';
    errorMessage.value = '';

    try {
        const formData = new FormData();
        formData.append('item_image', file);

        // /upload エンドポイントに POST
        const response: any = await authenticatedFetch('/upload', {
            method: 'POST',
            body: formData,
            // FormDataを使うため、headersのContent-Typeは設定しない
            headers: { 'Content-Type': undefined } as any, // TypeScriptを黙らせるハック
        });

        const uploadedPath = response.image_path; // サーバーからの保存パス
        form.value.item_image = uploadedPath;
        successMessage.value = '商品画像をアップロードできました！';
    } catch (error: any) {
        console.error('画像アップロードエラー:', error);
        if (error.status === 422) {
            // 422バリデーションエラーの場合
            const errorData = error.errors;
            serverErrors.value.item_image = errorData?.item_image || '画像ファイルが無効です。';
        } else {
            // その他エラー
            errorMessage.value = error.message || `画像アップロード中に予期せぬエラーが発生しました (Status: ${error.status})。`;
        }
    } finally {
        isImageUploading.value = false;
        // ファイルインプットをリセット
        if (input) input.value = '';
    }
};

/**
 * フォームの送信処理 (商品出品)
 */
const submitNewData = async () => {
    // 早期リターン
    if (isSubmitting.value || isLoading.value || !isAuthenticated.value || !hasVerifiedEmail.value) return;

    isSubmitting.value = true;
    serverErrors.value = {};
    successMessage.value = '';
    errorMessage.value = '';

    // 画像未アップロードのクライアントサイドチェック（APIコール前に表示）
    if (!form.value.item_image) {
        serverErrors.value.item_image = ['商品画像をアップロードしてください。'];
        errorMessage.value = '入力内容に誤りがあります。ご確認ください。';
        isSubmitting.value = false;
        return;
    }

    try {
        // /items エンドポイントに POST
        await authenticatedFetch('/items', {
            method: 'POST',
            body: {
                ...form.value,
                // priceがnullでないことを確認し、数値型として送信
                price: form.value.price !== null ? Number(form.value.price) : null,
            },
        });

        successMessage.value = '商品を出品しました。サンクスページへ移動します。';

        // 成功時のリダイレクト
        setTimeout(() => {
            router.push('/sell/thanks'); // 実際のサンクスページパスに修正
        }, 1500);

    } catch (error: any) {
        console.error('出品エラー:', error);
        if (error.status === 422) {
            // 422バリデーションエラーの場合
            serverErrors.value = error.errors || {};
            errorMessage.value = '入力内容に誤りがあります。ご確認ください。';
        } else if (error.status === 401) {
            // 401認証エラー
            errorMessage.value = error.message || '認証エラーが発生しました。再ログインしてください。';
            // ログインページへリダイレクト
            setTimeout(() => router.push('/login'), 1500);
        } else {
            // その他エラー
            errorMessage.value = error.message || `出品中に予期せぬエラーが発生しました (Status: ${error.status})。`;
        }
    } finally {
        isSubmitting.value = false;
    }
};

/**
 * 画像選択ボタンクリックで隠されたファイルインプットをクリックする関数
 */
const triggerFileInput = () => {
    fileInput.value?.click();
};
</script>

<template>
<div class="flex justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
    <div class="w-full max-w-2xl bg-white p-8 sm:p-10 shadow-xl rounded-xl border border-gray-100">

        <div v-if="isLoading" class="flex items-center justify-center min-h-[50vh]">
            <p class="text-lg text-gray-700 p-8">認証状態を確認中です...</p>
        </div>
        <div v-else-if="!isAuthenticated || !hasVerifiedEmail" class="flex items-center justify-center min-h-[50vh]">
            <div class="text-red-700 p-8 bg-white shadow-lg rounded-lg">
                {{ errorMessage || 'アクセス権限がありません。ログインページへリダイレクト中です。' }}
            </div>
        </div>

        <div v-else>
            <h1 class="text-3xl font-bold text-gray-800 text-center mb-8 border-b pb-4">
                商品の出品
            </h1>

            <div v-if="successMessage" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
                {{ successMessage }}
            </div>
            <div v-else-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                {{ errorMessage }}
            </div>

            <section class="mb-8 border-b pb-6">
                <label class="block text-lg font-bold text-gray-700 mb-4">
                    商品画像 <span class="text-red-500 text-sm">(必須)</span>
                </label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center space-y-4 bg-gray-50 min-h-[150px]">
                    <button
                        type="button"
                        class="px-6 py-2 text-red-600 font-semibold border-2 border-red-600 bg-white rounded-full hover:bg-red-50 transition duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="isImageUploading || isSubmitting"
                        @click="triggerFileInput"
                    >
                        {{ isImageUploading ? 'アップロード中...' : '画像を選択する' }}
                    </button>
                    <input
                        type="file"
                        ref="fileInput"
                        @change="handleImageUpload"
                        style="display: none;"
                        accept="image/jpeg, image/png"
                    >
                    <div v-if="serverErrors.item_image" class="text-red-500 text-sm font-medium">
                        {{ Array.isArray(serverErrors.item_image) ? serverErrors.item_image[0] : serverErrors.item_image }}
                    </div>
                    <div v-if="form.item_image" class="text-green-600 font-medium text-sm mt-2">
                        <p>✅ 画像がアップロードされました。</p>
                        </div>
                </div>
            </section>

            <form @submit.prevent="submitNewData">
                <section class="mb-10">
                    <h2 class="text-xl font-bold text-gray-700 border-b-2 border-gray-200 pb-2 mb-6">
                        商品の詳細
                    </h2>

                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-3">カテゴリー <span class="text-red-500 text-sm">(必須)</span></label>
                        <div class="flex flex-wrap justify-center gap-2 px-0 py-2 category-buttons-container">
                            <template v-for="(cat, index) in categories" :key="index">
                                <input
                                    type="checkbox"
                                    :id="`cat${index}`"
                                    :value="cat"
                                    class="category-checkbox-input"
                                    v-model="form.category"
                                >
                                <label :for="`cat${index}`" class="category-checkbox-label">
                                    {{ cat }}
                                </label>
                            </template>
                        </div>
                        <div v-if="serverErrors.category" class="text-red-500 text-sm mt-2">
                            {{ Array.isArray(serverErrors.category) ? serverErrors.category[0] : serverErrors.category }}
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-3">商品の状態 <span class="text-red-500 text-sm">(必須)</span></label>
                        <select
                            class="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2"
                            v-model="form.condition"
                        >
                            <option :value="null" disabled>選択してください</option>
                            <option v-for="(cond, index) in conditions" :key="index" :value="cond">{{ cond }}</option>
                        </select>
                        <div v-if="serverErrors.condition" class="text-red-500 text-sm mt-2">
                            {{ Array.isArray(serverErrors.condition) ? serverErrors.condition[0] : serverErrors.condition }}
                        </div>
                    </div>
                </section>

                <section class="mb-10">
                    <h2 class="text-xl font-bold text-gray-700 border-b-2 border-gray-200 pb-2 mb-6">
                        商品名と説明
                    </h2>

                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-3">商品名 <span class="text-red-500 text-sm">(必須)</span></label>
                        <input type="text" class="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2" v-model="form.name">
                        <div v-if="serverErrors.name" class="text-red-500 text-sm mt-2">
                            {{ Array.isArray(serverErrors.name) ? serverErrors.name[0] : serverErrors.name }}
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-3">ブランド名</label>
                        <input type="text" class="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2" v-model="form.brand">
                        <div v-if="serverErrors.brand" class="text-red-500 text-sm mt-2">
                            {{ Array.isArray(serverErrors.brand) ? serverErrors.brand[0] : serverErrors.brand }}
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-3">商品の説明 <span class="text-red-500 text-sm">(必須)</span></label>
                        <textarea class="w-full border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-2 min-h-[120px] resize-y" v-model="form.explain"></textarea>
                        <div v-if="serverErrors.explain" class="text-red-500 text-sm mt-2">
                            {{ Array.isArray(serverErrors.explain) ? serverErrors.explain[0] : serverErrors.explain }}
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-3">販売価格 <span class="text-red-500 text-sm">(必須)</span></label>
                        <div class="relative">
                            <span class="currency-symbol absolute left-3 top-1/2 transform -translate-y-1/2 text-xl font-semibold text-gray-500">
                                ¥
                            </span>
                            <input
                                type="text"
                                class="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 pl-10 pr-2 text-right text-lg font-semibold"
                                v-model.number="form.price"
                                inputmode="numeric"
                            >
                        </div>
                        <div v-if="serverErrors.price" class="text-red-500 text-sm mt-2">
                            {{ Array.isArray(serverErrors.price) ? serverErrors.price[0] : serverErrors.price }}
                        </div>
                    </div>
                </section>

                <div class="mt-10">
                    <button
                        type="submit"
                        class="w-full py-3 bg-red-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="isSubmitting || isImageUploading || !form.item_image"
                    >
                        {{ isSubmitting ? '出品処理中...' : '出品する' }}
                    </button>
                    <div v-if="!form.item_image && !isImageUploading && !isSubmitting" class="text-red-500 text-sm mt-3 text-center">
                        商品画像をアップロードしてください。
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
</template>

<style scoped>
/* カテゴリーボタンのスタイル */
.category-checkbox-input {
    display: none;
}

.category-checkbox-label {
    padding: 6px 14px;
    font-size: 0.75rem; /* text-xs */
    font-weight: 600; /* font-semibold */
    border: 2px solid #ef4444; /* red-500 */
    color: #ef4444;
    border-radius: 9999px; /* rounded-full */
    cursor: pointer;
    background-color: white;
    transition: background-color 0.2s, border-color 0.2s, color 0.2s;
    line-height: 1;
    white-space: nowrap;
}

.category-checkbox-input:checked+.category-checkbox-label {
    background-color: #ef4444; /* red-500 */
    color: #fff;
    border-color: #ef4444;
}
</style>

