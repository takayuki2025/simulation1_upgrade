<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // ★ 追記: useRouterをインポート
import { useItemStore } from '@/stores/item'; 
import { useAuthStore } from "@/stores/auth"; 
import { useAuth } from "~/composables/useAuth"; 

// =======================================================
// 認証ストアとトークンの取得
// =======================================================
const authStore = useAuthStore();
const { token: localToken } = useAuth(); 

// --- コメントコンポーネント (単一ファイル制約のためここで定義) ---
const CommentSection = {
  setup() {
    const itemStore = useItemStore();
    const authStore = useAuthStore(); 
    const newComment = ref('');
    const commentError = ref('');

    const isLoggedIn = computed(() => authStore.user !== null); 

    const submitComment = async () => {
      commentError.value = '';
      if (!newComment.value.trim()) {
        commentError.value = 'コメントを入力してください。';
        return;
      }
      if (!isLoggedIn.value) { 
        commentError.value = 'コメントを投稿するにはログインが必要です。';
        return;
      }
      
      await itemStore.postComment(newComment.value); 
      
      if (itemStore.errors.length === 0) {
        newComment.value = '';
      } else {
        commentError.value = itemStore.errors.value.join(', '); 
      }
    };

    return { itemStore, newComment, commentError, submitComment, isLoggedIn }; 
  },
  template: `
    <div class="space-y-6">
      <div v-if="isLoggedIn" class="bg-gray-50 p-4 rounded-lg shadow">
        <textarea
          v-model="newComment"
          rows="3"
          placeholder="コメントを入力..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
        <p v-if="commentError" class="text-sm text-red-500 mt-1">{{ commentError }}</p>
        <button
          @click="submitComment"
          class="mt-3 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150"
        >
          コメントを投稿
        </button>
      </div>
      <div v-else class="text-center p-4 bg-yellow-50 rounded-lg text-yellow-800">
        <p>コメントを投稿するにはログインが必要です。</p>
      </div>

      <div v-if="itemStore.comments.length > 0" class="border-t pt-4">
        <div 
          v-for="comment in itemStore.comments" 
          :key="comment.id" 
          class="border-b last:border-b-0 py-4"
        >
          <div class="flex items-start mb-2">
            <img class="h-8 w-8 rounded-full object-cover mr-3" :src="comment.user.user_image || 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=User'" :alt="comment.user.name + ' Avatar'">
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-gray-900">{{ comment.user.name }}</span>
              <span class="text-xs text-gray-500">{{ new Date(comment.created_at).toLocaleString() }}</span>
            </div>
          </div>
          <p class="text-gray-700 pl-11 whitespace-pre-line">{{ comment.comment }}</p>
        </div>
      </div>
      <div v-else class="text-center py-4 text-gray-500">
        まだコメントはありません。
      </div>
    </div>
  `
};
// ------------------------------------------------------------------------

const itemStore = useItemStore();
const route = useRoute();
const router = useRouter(); // ★ 追記: useRouterをインスタンス化

// ★ 追記: 購入ページへ遷移する関数
const navigateToPurchase = () => {
  // 1. ログイン状態の確認
  if (!authStore.user) {
    alert('購入するにはログインが必要です。');
    // ログインページへリダイレクトすることも考慮
    // router.push('/login'); 
    return;
  }

  // 2. 売り切れ状態の確認
  if (itemStore.isSold) {
    alert('この商品は売り切れました。');
    return;
  }

  // 3. 商品IDの確認と遷移
  if (itemStore.item && itemStore.item.id) {
    // Vue Routerで `/purchase/:itemId` のようなルートに遷移
    // Laravel側でBlade表示のための /purchase/{item_id} ルートが定義されている場合、
    // 実際にはそのパスへブラウザをリダイレクトする必要があります。
    // SPAのVue Routerでページ遷移させる場合は `/purchase/${itemStore.item.id}` を使用します。
    // 今回はSPA内でページ遷移させることを想定し、Vue Routerの push を使用します。
    router.push(`/purchase/${itemStore.item.id}`);
    
    // 【補足】もしLaravelのRoute::get('/purchase/{item_id}', ...) に直接ブラウザを遷移させる（SPAを抜ける）場合は、
    // window.location.href = `/purchase/${itemStore.item.id}`; 
    // と記述します。しかし、通常のVue/Nuxtプロジェクトでは `router.push` が推奨されます。
  }
};


onMounted(async () => {
  // 1. 認証状態の解決を待つ (見本ファイルと同様の重要なステップ)
  console.log("[onMounted] Waiting for auth resolution...");
  await authStore.waitForAuthResolution(); 
  console.log("[onMounted] Auth resolved. Proceeding to fetch item detail.");

  // 2. ルートパラメータからIDを取得
  const itemIdParam = route.params.id;
  
  const itemId = Number(itemIdParam); 

  // 3. 有効な数値であることを確認してストアアクションを呼び出す
  if (!isNaN(itemId) && itemId > 0) {
    console.log("商品IDを取得:", itemId);

    // ★ 修正された ItemStore アクション (トークンを含める) を呼び出す
    // ItemStoreのfetchItemDetail内でlocalToken.valueを使う実装を想定
    await itemStore.fetchItemDetail(itemId, localToken.value); 
  } else {
    itemStore.errors.value.push("URLから有効な商品IDが取得できませんでした。");
    console.error("URLから有効な商品IDが取得できませんでした。取得した値:", itemIdParam);
  }
});
</script>

<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">
    <div v-if="itemStore.isLoading" class="text-center py-10">
      <p class="text-xl text-indigo-600 font-semibold">読み込み中...</p>
    </div>

    <div v-else-if="itemStore.errors.length" class="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
      <h2 class="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
      <p v-for="error in itemStore.errors" :key="error" class="text-red-500 mb-2">{{ error }}</p>
      <p class="text-gray-600 mt-4">ルーティングやサーバー側のエラーを確認してください。</p>
    </div>

    <div v-else-if="itemStore.item" class="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <div class="md:flex">
        <div class="md:flex-shrink-0">
          <img 
            :src="itemStore.item.item_image" 
            alt="商品画像" 
            class="h-64 w-full object-cover md:w-64 rounded-t-xl md:rounded-l-xl md:rounded-t-none"
            onerror="this.onerror=null; this.src='https://placehold.co/600x400/D1D5DB/1F2937?text=No+Image';"
          >
        </div>
        <div class="p-8 flex flex-col justify-between w-full">
          <div>
            <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {{ itemStore.item.condition }} / {{ itemStore.item.brand || 'ブランド不明' }}
            </div>
            <h1 class="block mt-1 text-4xl leading-tight font-extrabold text-gray-900">
              {{ itemStore.item.name }}
            </h1>
            <p class="mt-2 text-2xl font-bold text-gray-800">
              ¥ {{ itemStore.displayPrice }}
            </p>
          </div>
          <div class="mt-4 flex flex-col space-y-3">
            <button 
              @click="itemStore.toggleFavorite(localToken.value)"
              :disabled="!authStore.user"
              class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-all duration-200"
              :class="{
                'bg-red-500 hover:bg-red-600 text-white': itemStore.isFavorited,
                'bg-white text-red-500 border-red-500 hover:bg-red-50': !itemStore.isFavorited
              }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
              </svg>
              お気に入り ({{ itemStore.favoritesCount }})
            </button>

            <button 
              @click="navigateToPurchase"
              :disabled="itemStore.isSold || !authStore.user"
              class="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg transition-all duration-200"
              :class="{
                'bg-indigo-600 hover:bg-indigo-700 text-white': !itemStore.isSold && authStore.user,
                'bg-gray-400 text-white cursor-not-allowed': itemStore.isSold || !authStore.user
              }"
            >
              {{ itemStore.isSold ? '売り切れ' : (!authStore.user ? 'ログインして購入' : '購入する') }}
            </button>

            <div class="mt-4 pt-4 border-t border-gray-100">
              <span class="text-xs text-gray-500">出品者:</span>
              <div class="flex items-center mt-1">
                <img class="h-10 w-10 rounded-full object-cover mr-3" :src="itemStore.item.user.user_image || 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=User'" alt="User Avatar">
                <span class="text-sm font-medium text-gray-900">{{ itemStore.item.user.name }}</span>
                <span v-if="itemStore.isSeller" class="ml-2 text-xs font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">自分</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">商品の説明</h2>
        <p class="text-gray-700 whitespace-pre-line">{{ itemStore.item.explain }}</p>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b pb-2">カテゴリ</h2>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="cat in itemStore.parsedCategories" 
            :key="cat"
            class="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full"
          >
            {{ cat }}
          </span>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b pb-2">コメント ({{ itemStore.comments.length }})</h2>
        <CommentSection />
      </div>

    </div>
  </div>
</template>

<style scoped>
/*
 * スタイルは前回のものをそのまま使用
 */
.loading-overlay, .error-display {
    text-align: center;
    padding: 100px;
    font-size: 1.5em;
    color: #555;
}

.item_detail_contents {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.item_detail_image {
    width: 50%;
    max-width: 450px;
    min-width: 300px;
    padding: 50px;
}

.item_detail_image1 {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    object-position: center;
}

.information {
    width: 50%;
    max-width: 450px;
    min-width: 300px;
    padding:50px;
}

.item_detail_name {
    max-width: 75%;
    overflow: hidden;
    font-size: 22px;
}

.item_detail_brand_2 {
    max-width: 50%;
    overflow: hidden;
}
.item_detail_icon {
    display: flex;
}

.item_detail_explain{
    max-width: 320px;
    word-break: break-all;
    overflow-wrap: break-word;
}

.explain_word {
    word-break: break-all;
    overflow-wrap: break-word;
    font-weight: 600;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.6;
}

.item_detail_category {
    display: flex;
}

.item_detail_condition {
    display: flex;
}

.info_submit {
    width: 350px;
    height: 30px;
    font-weight: bold;
    font-size: 17px;
    display: block;
    color: aliceblue;
    border: #ff5555;
    background-color: #ff5555;
    text-decoration: none;
    text-align: center;
    line-height: 30px; 
}

.comment {
    max-width: 320px;
    word-break: break-all;
    overflow-wrap: break-word;
    margin-bottom: 20px; 
    padding-top: 10px;
    border-top: 1px dashed #ccc;
}

.comment:first-of-type {
    border-top: none;
}

.comment-text {
    font-weight: 600;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.6;
}

.comment_submit {
    width: 350px;
    height: 30px;
    margin-top: 15px;
    display: block;
    color: aliceblue;
    border: #ff5555;
    background-color: #ff5555;
    text-decoration: none;
    text-align: center;
    font-weight: 800;
    line-height: 30px; 
}

h3 {
    position: relative;
    left: 20px;
    font-size: 14px;
}

p {
    position: relative;
    left: 20px;
    font-size: 14px;
}

.price_after {
    font-size: 19px;
    font-weight: 500;
}

.item_detail_icon p {
    position: relative;
    top: 15px;
    left: 40px;
}

.error_massage {
    color: red;
    list-style-type: none;
    padding-left: 0;
    margin-top: 10px;
}

.info_submit {
    text-decoration: none;
    text-align: center;
}

.category_views {
    display: flex;
    padding-left: 0; 
}

.item_detail_brand {
    display: flex;
}

.item_detail_brand_1 {
    font-weight: 700;
}

.item_detail_brand_2 {
    position: relative;
    left: 50px;
    font-weight: 600;
}

.category_mark01 {
    position: relative;
    right: 22px;
    font-weight: 700;
    list-style: none;
}

.category_mark {
    position: relative;
    left: 20px;
    margin-right: 10px;
    list-style: none;
    background-color: #d9d9d9;
    border-radius: 10px;
    font-size: 13px;
    align-items: center;
    display: flex;
    justify-content: center;
    width: 70px;
    font-size: 11px;
    font-weight: 600;
    height: 20px; 
}

.item_detail_condition_1 {
    font-size: 16px;

}

.item_detail_condition_2 {
    position: relative;
    left: 50px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.comment_count_flex {
    display: flex;
    color: #5f5f5f;
}

.comment_name_image {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.comment_name {
    position: relative;
    bottom: 0px;
    left: 10px; 
    font-size: 17px;
    font-weight: 700;
}

.comment_word {
    position: relative;
    top: 8px;
    font-size: 18px;
}

.user_image_css {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    object-fit: cover;
    object-position: center;
    position: relative;
    left: 20px; 
}

.favorite_button {
    position: relative;
    left: 27px;
    bottom: 15px;
    font-size: 30px;
    border: none;
    margin: 0;
    padding: 0;
    background-color: transparent; 
    cursor: pointer;
}

.star_text {
    position: relative;
    left: 56px;
    bottom: 18px;
    font-size: 30px;
}

.user_ster_icon {
    position: relative;
    left: 31px;
    font-size: 30px;
}

.ster_icon_1 {
    position: relative;
    right: 7px;
    color: black;
    font-size: 30px; 
}

.ster_icon_2 {
    position: relative;
    right: 4px;
    font-size: 30px !important;
    color: rgb(0, 0, 0);
}

.comments_count0 {
    margin-left: 30px;
    position: relative;
    left: 50px;
    top: 20px;
}

.comments_count {
    position: relative;
    top: 27px;
    margin-left: 10px;
}

.comments_icon {
    position: relative;
    left: 90px;
    bottom: 15px;
    font-size: 28px;
}

@media (max-width: 768px) {
    .item_detail_image,
    .information {
        width: 100%;
        max-width: 100%;
        min-width: unset;
        padding: 20px;
    }

    .info_submit, .comment_submit {
        width: 100%;
        max-width: 450px;
    }
}
</style>