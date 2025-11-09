<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useItemStore } from '@/stores/item';
import { useAuthStore } from '@/stores/auth';
import { useAuth } from '~/composables/useAuth';

// =======================================================
// ストア・ルータ初期化
// =======================================================
const route = useRoute();
const router = useRouter();
const itemStore = useItemStore();
const authStore = useAuthStore();
const { token: localToken } = useAuth(); // useAuth composable からトークン取得

// =======================================================
// リアクティブデータ
// =======================================================
const itemId = ref<number | null>(null);
const isLoading = ref(true);
const error = ref('');
const { item } = storeToRefs(itemStore);
const { user } = storeToRefs(authStore);

// =======================================================
// 購入情報取得
// =======================================================
const fetchPurchaseData = async (id: number) => {
  try {
    isLoading.value = true;
    error.value = '';

    // 🔹 トークン確認
    const token = localToken.value;
    if (!token) {
      console.warn('[fetchPurchaseData] トークンが存在しません。ログインページへ遷移します。');
      router.push('/login');
      return;
    }

    // 🔹 商品詳細取得
    console.log('[fetchPurchaseData] Fetching item detail...');
    await itemStore.fetchItemDetail(id, token);

    if (itemStore.errors.length > 0) {
      throw new Error(itemStore.errors[0]);
    }

    if (!item.value) {
      throw new Error('商品情報の取得に失敗しました。');
    }

    // 🔹 ユーザー情報取得
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
// =======================================================
const navigateToAddressEdit = () => {
  if (item.value && user.value?.id) {
    router.push(`/purchase/address/${item.value.id}/${user.value.id}`);
  } else {
    error.value = 'ユーザー情報が未取得のため、住所変更ページに遷移できません。';
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-900 mb-8 border-b pb-2">購入手続き: 配送先住所の確認</h1>

    <!-- 🔹 ローディング中 -->
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-xl text-indigo-600 font-semibold">購入情報を読み込み中...</p>
    </div>

    <!-- 🔹 エラー発生 -->
    <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
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

    <!-- 🔹 正常表示 -->
    <div v-else-if="item && user" class="space-y-8">
      <!-- 商品情報 -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 border-b pb-2">購入商品</h2>
        <div class="flex items-center space-x-4">
          <img
            :src="item.item_image"
            alt="商品画像"
            class="w-20 h-20 object-cover rounded-md"
            onerror="this.onerror=null; this.src='https://placehold.co/100x100/D1D5DB/1F2937?text=No+Image';"
          />
          <div>
            <p class="font-medium text-gray-900">{{ item.name }}</p>
            <p class="text-2xl font-bold text-indigo-600">¥ {{ item.price.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- 配送先住所 -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 border-b pb-2 flex justify-between items-center">
          配送先住所
          <button
            @click="navigateToAddressEdit"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150"
          >
            住所を変更
          </button>
        </h2>

        <div class="space-y-1 text-gray-700">
          <p class="font-bold">{{ user.name }}様</p>
          <p>〒{{ user.post_number || '未登録' }}</p>
          <p>{{ user.address || '住所未登録' }}</p>
          <p v-if="user.building">{{ user.building }}</p>
        </div>
      </div>

      <!-- 購入ボタン -->
      <div class="pt-4">
        <button
          @click="error = '購入処理は未実装です。'"
          class="w-full py-3 bg-indigo-600 text-white font-bold text-lg rounded-lg hover:bg-indigo-700 transition duration-150 shadow-xl"
        >
          購入を確定する
        </button>
      </div>
    </div>

    <!-- 🔹 フォールバック -->
    <div v-else class="text-center py-10 bg-yellow-50 border-y border-yellow-300">
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
   全体レイアウト
   ======================================================== */
.item_buy_contents {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    position: relative; /* loading overlay用 */
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    z-index: 10;
}

.item_buy_lr {
    display: flex;
    flex-wrap: wrap; 
}

.item_buy_l {
    width: 65%;
    padding-right: 20px; 
}

.item_buy_r {
    width: 35%;
    min-width: 350px; 
    padding-left: 20px;
}

/* ========================================================
   左カラム (L) - 商品情報エリア
   ======================================================== */
.item_buy_content1 {
    display: flex;
    border-bottom: 2px solid black;
    margin: 90px;
    max-width: 100%;
    position: relative;
}

.item_buy_image {
    width: 19%;
    min-width: 120px;
    aspect-ratio: 1 / 1;
    margin-bottom: 20px;
}

.item_buy_image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.item_name {
    position: absolute;
    left: 180px;
    bottom: 100px; 
    font-size: 23px;
    font-weight: 800;
}

.item_price {
    position: absolute;
    left: 185px;
    top: 20px;
    font-size: 20px;
    font-weight: 600;
    color: #000000;
}

/* ========================================================
   左カラム (L) - 支払い方法
   ======================================================== */
.item_buy_content2 {
    margin: 90px;
    border-bottom: 2px solid black;
    padding-bottom: 10px;
}

.item_pay {
    position: relative;
    left: 30px;
    bottom: 60px;
}

#payment_select {
    position: relative;
    bottom: 50px;
    left: 60px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: white;
}
#payment_select:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
}

/* ========================================================
   左カラム (L) - 配送先
   ======================================================== */
.item_buy_content3 {
    margin: 90px;
    border-bottom: 2px solid black;
    height: 110px;
}

.item_edit {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.item_edit_a {
    text-decoration: none;
    color: #0000FF;
    font-weight: 600;
    position: relative;
    bottom: 50px;
    cursor: pointer;
}

.item_address {
    position: relative;
    bottom: 80px;
    left: 40px;
}

.item_address_view1, .item_address_view2 {
    position: relative;
    bottom: 100px;
    left: 70px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 90%;
    margin-bottom: 5px;
}

/* ========================================================
   右カラム (R) - 集計エリア
   ======================================================== */
.item_buy_select {
    margin: 80px 0 80px 80px;
    padding-top: 10px;
}

.buy_price, .buy_payment {
    border: 1px solid black;
    height: 80px;
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: -1px;
}

.price_view {
    font-weight: 600;
    position: relative;
    top: 10px;
    right: 20px;
    text-align: center;
}

.pay_view  {
    font-weight: 600;
    position: relative;
    top: 10px;
    left: 40px;
}

#selected_payment_text {
    position: relative;
    left: 30px;
    font-weight: normal;
}

/* ========================================================
   右カラム (R) - 購入ボタン
   ======================================================== */
.item_buy_form {
    position: relative;
    margin: 80px 0 80px 80px;
}

.item_buy_submit {
    width: 315px;
    height: 40px;
    background-color: #ff5555;
    color: white;
    border: none;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.item_buy_submit:hover:not(:disabled) {
    background-color: #e54d4d;
}

.item_buy_submit:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.loading-button-area p {
    text-align: center;
    padding: 10px 0;
    color: #4b5563;
    font-style: italic;
    width: 315px;
}

/* ========================================================
   エラーメッセージ
   ======================================================== */
.error_buy {
    color: red;
    font-size: 14px;
    position: relative;
    left: 60px;
    top: -45px;
    display: block;
}

.alert-danger {
    color: red;
    font-size: 14px;
    padding-top: 10px;
    text-align: center;
    width: 315px;
}


/* ========================================================
   レスポンシブ対応
   ======================================================== */
@media (max-width: 900px) {
    .item_buy_l, .item_buy_r {
        width: 100%;
        padding-left: 0;
        padding-right: 0;
    }
    
    .item_buy_content1, .item_buy_content2, .item_buy_content3 {
        margin: 40px 20px;
    }

    .item_buy_r > * {
        margin: 40px auto;
        width: fit-content;
    }
    .item_buy_select {
        margin-left: auto;
        margin-right: auto;
    }
    .buy_price, .buy_payment {
        width: 300px;
        margin-left: auto;
        margin-right: auto;
    }

    .item_buy_form {
        margin-left: auto;
        margin-right: auto;
    }

    .item_buy_submit, .loading-button-area p {
        width: 300px;
    }
    
    .item_name {
        left: 35%;
        bottom: 50px;
        font-size: 20px;
    }
    .item_price {
        left: 35%;
        top: 20px;
        font-size: 18px;
    }
}

@media (max-width: 600px) {
    .item_buy_image {
        width: 30%;
        min-width: 100px;
    }
    .item_buy_content1 {
        flex-direction: row;
        align-items: center;
        margin: 20px 10px;
    }
}
</style>