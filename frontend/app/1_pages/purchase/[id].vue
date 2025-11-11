<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useItemStore } from '@/stores/item';
import { useAuthStore } from '@/stores/auth';
import { useAuth } from '~/composables/useAuth';

// =======================================================
// ストア・ルータ初期化
// ※ オリジナルのコードから変更なし
// =======================================================
const route = useRoute();
const router = useRouter();
const itemStore = useItemStore();
const authStore = useAuthStore();
const { token: localToken } = useAuth();

// =======================================================
// リアクティブデータ
// =======================================================
const itemId = ref<number | null>(null);
const isLoading = ref(true);
const error = ref('');
const { item } = storeToRefs(itemStore);
const { user } = storeToRefs(authStore);

// 🔹 支払い方法の管理
const selectedPayment = ref<string>('');
const paymentOptions = [
    { value: '', text: '選択してください' },
    { value: 'コンビニ払い', text: 'コンビニ払い' },
    { value: 'カード支払い', text: 'カード支払い' }
];

// 🔹 選択された支払い方法の表示テキスト
const selectedPaymentText = computed(() => {
    const option = paymentOptions.find(opt => opt.value === selectedPayment.value);
    return option ? option.text : 'なし';
});

// 🔹 購入ボタンの活性状態
const canPurchase = computed(() => {
    return !isLoading.value && item.value?.remain > 0 && selectedPayment.value !== '';
});

// ★★★ 画像URL正規化ロジック (必須の修正) ★★★
// ここでベースURLを定義し、画像パスの二重結合を防ぎます
const IMAGE_BASE_URL = 'https://laravel.test:4430/';

const fullImageUrl = computed(() => {
  if (!item.value || !item.value.item_image) {
    return 'https://placehold.co/96x96/D1D5DB/1F2937?text=No+Image';
  }
  let imagePath = item.value.item_image;

  // 1. Pathが既に絶対URLなら、二重結合をチェックしつつそのまま返す
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    const base = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL : `${IMAGE_BASE_URL}/`;
    
    // パスの中にベースURLが2回以上含まれていないかチェック
    if (imagePath.includes(base) && imagePath.indexOf(base) !== imagePath.lastIndexOf(base)) {
        // 例: '.../storage/https://laravel.test:4430/storage/...' の場合、2回目のベースURLから切り出す
        const correctedPathIndex = imagePath.lastIndexOf(base);
        return imagePath.substring(correctedPathIndex);
    }
    
    return imagePath;
  }

  // 2. ベースURLを正規化（末尾のスラッシュを必ず持つ）
  const base = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL : `${IMAGE_BASE_URL}/`;
  
  // 3. imagePathから先頭の `/` や `storage/` などのプレフィックスを全て除去し、クリーンな相対パスを得る
  let cleanPath = imagePath.replace(/^(\/|storage\/)+/, '');

  // 4. ベースURL + /storage/ + クリーンなパス を結合
  const finalUrl = `${base}storage/${cleanPath}`;
  
  return finalUrl;
});
// ★★★ 画像URL正規化ロジック 終わり ★★★


// =======================================================
// 購入情報取得
// ※ オリジナルのコードから変更なし
// =======================================================
const fetchPurchaseData = async (id: number) => {
    try {
        isLoading.value = true;
        error.value = '';
        const token = localToken.value;
        if (!token) {
            console.warn('[fetchPurchaseData] トークンが存在しません。ログインページへ遷移します。');
            router.push('/login');
            return;
        }
        console.log('[fetchPurchaseData] Fetching item detail...');
        await itemStore.fetchItemDetail(id, token);

        if (itemStore.errors.length > 0 || !item.value) {
            throw new Error(itemStore.errors.length > 0 ? itemStore.errors[0] : '商品情報の取得に失敗しました。');
        }

        console.log('[fetchPurchaseData] Fetching user info...');
        await authStore.fetchUser();

        if (!user.value) {
            throw new Error('ユーザー情報の取得に失敗しました。');
        }

        console.log('[fetchPurchaseData] ✅ 商品・ユーザー情報の取得成功');
    } catch (e: any) {
        console.error('データ取得エラー:', e);
        error.value = e.message || 'データの取得中にエラーが発生しました。';
    } finally {
        isLoading.value = false;
    }
};

// =======================================================
// onMounted：認証待機 → データ取得
// ※ オリジナルのコードから変更なし
// =======================================================
onMounted(async () => {
    console.log('[onMounted] 🔸 開始: auth解決を待機中...');
    await authStore.waitForAuthResolution();
    console.log('[onMounted] ✅ Auth解決完了');

    const idParam = route.params.id;
    const id = Array.isArray(idParam) ? parseInt(idParam[0]) : parseInt(idParam as string);

    if (isNaN(id)) {
        error.value = '無効な商品IDです。';
        isLoading.value = false;
        return;
    }

    itemId.value = id;
    await fetchPurchaseData(id);
});

// =======================================================
// 住所編集ページへ遷移
// ※ オリジナルのコードから変更なし
// =======================================================
const navigateToAddressEdit = () => {
    if (item.value && user.value?.id) {
        // 仮の遷移先。Bladeファイルでは route('item.purchase.edit') に相当。
        // Nuxt側のルーティングに合わせて調整してください。
        router.push(`/purchase/address/${item.value.id}/${user.value.id}`);
    } else {
        error.value = 'ユーザー情報が未取得のため、住所変更ページに遷移できません。';
    }
};

// 🔹 追加: 購入処理 (Bladeファイルの form action の代替)
const submitPurchase = () => {
    if (!canPurchase.value) {
        error.value = '支払い方法を選択するか、在庫があることを確認してください。';
        return;
    }
    // TODO: ここに実際の購入API連携ロジックを実装する
    console.log('購入を確定:', {
        item_id: item.value?.id,
        payment: selectedPayment.value,
        address: user.value?.address,
    });
    // 仮で thanks_buy_create に相当するページに遷移
    router.push('/thanks-buy-create');
};
</script>

<template>
    <div class="item_buy_contents">

            <div v-if="isLoading" class="loading-overlay">購入情報を読み込み中...</div>

            <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mb-8">
                <p class="font-bold">データの取得エラー</p>
                <p>{{ error }}</p>
                <div class="mt-2">
                    <button
                        @click="fetchPurchaseData(itemId!)"
                        class="py-1 px-3 bg-red-200 text-red-800 rounded-lg hover:bg-red-300 transition duration-150 text-sm font-semibold"
                    >
                        再読み込みを試す
                    </button>
                </div>
            </div>

            <div v-else-if="item && user" class="item_buy_lr">

                <div class="item_buy_l">
                    
                    <div class="item_buy_content_section flex items-center py-8 border-b border-gray-300">
                        <div class="item_buy_image mr-6">
                            <!-- ★★★ 修正箇所: fullImageUrl を使用して画像の二重結合エラーを解消 ★★★ -->
                            <img
                                :src="fullImageUrl"
                                alt="商品の画像"
                                class="w-24 h-24 object-cover rounded"
                                onerror="this.onerror=null; this.src='https://placehold.co/96x96/D1D5DB/1F2937?text=No+Image';"
                            />
                        </div>
                        <div>
                            <h3 class="item_name text-xl font-bold text-gray-900 mb-1">{{ item.name }}</h3>
                            <h2 class="item_price text-2xl font-bold text-gray-900">¥{{ item.price.toLocaleString() }}</h2>
                        </div>
                    </div>

                    <div class="item_buy_content_section py-8 border-b border-gray-300">
                        <h4 class="text-xl font-bold text-gray-900 mb-4">支払い方法</h4>
                        <select
                            id="payment_select"
                            name="payment"
                            v-model="selectedPayment"
                            :disabled="item.remain <= 0"
                            class="block w-full max-w-xs p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option
                                v-for="option in paymentOptions"
                                :key="option.value"
                                :value="option.value"
                                :disabled="!option.value"
                            >
                                {{ option.text }}
                            </option>
                        </select>
                        <div v-if="selectedPayment === '' && !canPurchase && item.remain > 0 && error" class="text-red-500 text-sm mt-2">
                            支払い方法を選択してください
                        </div>
                    </div>

                    <div class="item_buy_content_section py-8 border-b border-gray-300">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="text-xl font-bold text-gray-900">配送先</h4>
                            <a @click.prevent="navigateToAddressEdit" class="text-blue-600 hover:underline text-base font-medium cursor-pointer">変更する</a>
                        </div>
                        <div class="space-y-1 text-gray-700 text-base">
                            <p>〒{{ user.post_number || '未登録' }}</p>
                            <p>{{ user.address || '住所未登録' }}</p>
                            <p v-if="user.building">{{ user.building }}</p>
                        </div>
                        <div v-if="!user.address" class="text-red-500 text-sm mt-2">配送先住所が未登録です</div>
                    </div>
                </div>

                <div class="item_buy_r">
                    <div class="item_buy_summary_box bg-white p-6 shadow-md rounded-lg">
                        <div class="flex justify-between items-center mb-4">
                            <p class="font-bold text-lg text-gray-800">商品代金:</p>
                            <p class="font-bold text-xl text-gray-900">¥{{ item.price.toLocaleString() }}</p>
                        </div>
                        <div class="flex justify-between items-center mb-6">
                            <p class="font-bold text-lg text-gray-800">支払い方法:</p>
                            <p id="selected_payment_text" class="font-semibold text-lg text-gray-900">{{ selectedPaymentText }}</p>
                        </div>
                        <div v-if="item.remain > 0">
                            <button
                                @click="submitPurchase"
                                :disabled="!canPurchase"
                                type="button"
                                class="w-full py-3 bg-red-500 text-white font-bold text-lg rounded-md hover:bg-red-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                購入する
                            </button>
                        </div>
                        <div v-else class="text-center pt-4">
                            <p class="text-2xl font-bold text-gray-500">SOLD</p>
                        </div>

                        <div v-if="error && !item.remain" class="text-red-500 text-sm mt-4 text-center">{{ error }}</div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-10 bg-yellow-50 border-y border-yellow-300 mt-8">
                <p class="text-yellow-600 font-semibold mb-2">予期せぬ状態</p>
                <p class="text-sm text-gray-600">ロード後にデータが表示されません。ページをリロードしてください。</p>
                <div class="mt-4">
                    <button
                        @click="fetchPurchaseData(itemId!)"
                        class="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-150 text-sm font-medium"
                    >
                        再読み込みを試す
                    </button>
                </div>
            </div>
        </div>
</template>

<style scoped>
/* ========================================================
全体のラッパーとローディングオーバーレイ
======================================================== */
.item_buy_wrapper {
    min-height: 100vh;
    background-color: #f3f4f6; /* Tailwind: bg-gray-100 */
}
.item_buy_contents {
    max-width: 900px; /* 完成イメージに合わせて中央コンテンツの最大幅を調整 */
    margin: 40px auto; /* ヘッダーの下に余白を設ける */
    padding: 20px;
    background-color: white; /* 中央コンテンツの背景色 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 影を追加 */
    border-radius: 8px; /* 角を丸くする */
    position: relative;
}
.loading-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    z-index: 10;
    border-radius: 8px; /* 親要素に合わせる */
}

/* ========================================================
ヘッダー (仮)
======================================================== */
.header {
    background-color: white;
    border-bottom: 1px solid #e5e7eb; /* Tailwind: border-gray-200 */
}
.header-inner {
    max-width: 1280px; /* Tailwind: max-w-7xl */
}
.search-input {
    width: 250px; /* 検索バーの幅を調整 */
}
.header-link {
    font-size: 1rem;
    color: #4b5563; /* Tailwind: text-gray-700 */
}
.header-button {
    font-size: 1rem;
    line-height: 1.5; /* ボタンのテキストの垂直位置を調整 */
}

/* ========================================================
左右カラムの分割
======================================================== */
.item_buy_lr {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px; /* ヘッダーとコンテンツの間の余白 */
}
.item_buy_l {
    width: 60%; /* 完成イメージに合わせて調整 */
    padding-right: 30px; /* 右カラムとの間隔を調整 */
}
.item_buy_r {
    width: 40%; /* 完成イメージに合わせて調整 */
    padding-left: 30px; /* 左カラムとの間隔を調整 */
}

/* ========================================================
左カラムのセクション共通スタイル
======================================================== */
.item_buy_content_section {
    padding-top: 30px;
    padding-bottom: 30px;
}
.item_buy_content_section:last-of-type {
    border-bottom: none; /* 最後のセクションの下線はなし */
}

/* ========================================================
商品情報エリア
======================================================== */
.item_buy_image {
    width: 96px; /* w-24 */
    height: 96px; /* h-24 */
    flex-shrink: 0; /* 画像が縮まないように */
}
.item_name {
    font-size: 1.25rem; /* text-xl */
    font-weight: 700; /* font-bold */
    color: #1a202c; /* text-gray-900 */
}
.item_price {
    font-size: 1.5rem; /* text-2xl */
    font-weight: 700; /* font-bold */
    color: #1a202c; /* text-gray-900 */
}

/* ========================================================
支払い方法エリア
======================================================== */
#payment_select {
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
    border-color: #d1d5db; /* border-gray-300 */
}

/* ========================================================
配送先エリア
======================================================== */
.item_buy_content_section .text-base {
    font-size: 1rem;
}

/* ========================================================
右カラム - 集計ボックス
======================================================== */
.item_buy_summary_box {
    border: 1px solid #d1d5db; /* border-gray-300 */
    border-radius: 8px; /* rounded-lg */
    background-color: #f9fafb; /* bg-gray-50 */
    padding: 24px; /* p-6 */
    margin-top: 30px; /* 左カラムと高さを合わせるため */
}

/* ========================================================
購入ボタン
======================================================== */
.item_buy_summary_box button {
    font-size: 1.125rem; /* text-lg */
    padding-top: 0.75rem; /* py-3 */
    padding-bottom: 0.75rem; /* py-3 */
    background-color: #ef4444; /* bg-red-500 */
    color: white;
    font-weight: 700; /* font-bold */
    border-radius: 0.375rem; /* rounded-md */
}

/* ========================================================
エラーメッセージ
======================================================== */
.text-red-500 {
    color: #ef4444;
}

/* ========================================================
レスポンシブ対応
======================================================== */
@media (max-width: 900px) {
    .header-inner {
        flex-direction: column;
        align-items: flex-start;
        padding-bottom: 1rem;
    }
    .header-inner > div:last-child {
        margin-top: 1rem;
        flex-wrap: wrap;
        width: 100%;
        justify-content: space-between;
    }
    .search-input {
        width: 100%;
        margin-bottom: 0.5rem;
    }
    .header-link, .header-button {
        flex-grow: 1;
        text-align: center;
    }
    .item_buy_lr {
        flex-direction: column;
    }
    .item_buy_l, .item_buy_r {
        width: 100%;
        padding-left: 0;
        padding-right: 0;
    }
    .item_buy_r {
        margin-top: 40px; /* 左右カラムの間に余白 */
    }
    .item_buy_content_section {
        padding-left: 0;
        padding-right: 0;
    }
}
@media (max-width: 600px) {
    .item_buy_contents {
        padding: 15px;
        margin: 20px auto;
    }
    .item_buy_image {
        width: 80px;
        height: 80px;
    }
    .item_name {
        font-size: 1.1rem;
    }
    .item_price {
        font-size: 1.3rem;
    }
    .item_buy_summary_box {
        padding: 15px;
    }
}
</style>