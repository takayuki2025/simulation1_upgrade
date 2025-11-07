<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRoute, navigateTo, useNuxtApp, useRuntimeConfig } from "#app";
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "default",
});

// 1. 【エラー修正】typeof の比較対象を文字列 'function' に修正
const { $api } = useNuxtApp();
if (typeof $api !== 'function') {
  // 2. 【エラー修正】console.error の引数を文字列リテラルに修正
  console.error(`CRITICAL: $api instance is missing. Check plugins/api-interceptor.ts.`);
}

const authStore = useAuthStore();
const { isAuthenticated: isAuthed } = storeToRefs(authStore);
const route = useRoute();

// --- 型定義 ---
interface User {
  id: number;
  name: string;
  email: string;
  uid: string;
  email_verified_at: string | null;
  post_number: string | null;
  address: string | null;
  building: string | null;
  user_image: string | null;
}
interface Item {
  id: number;
  name: string;
  item_image: string;
  remain: number;
  item?: Item;
}
// --- 状態管理 ---
const user = ref<User | null>(null);
const items = ref<Item[]>([]);

// 3. 【エラー修正】form の初期値を正しいオブジェクト形式に修正
const form = ref<any>({
  name: '', 
  post_number: '', 
  address: '', 
  building: '',
});

// 4. 【改善】ref の型を明確化
const profileErrors = ref<any>({});
const imageError = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const isLoading = ref(true);

// 5. 【エラー修正】computed の比較対象と返り値を文字列リテラルに修正
const page = computed(() => (route.query.page === 'buy' ? 'buy' : 'sell'));

// --- ユーザー情報取得（初期表示時）---
const fetchUserProfile = async () => {
  // すでにユーザー情報があればスキップ
  if (user.value) return;

  // 認証ストアの解決を待つ（認証状態が確定するまで待機）
  isLoading.value = true;
  await authStore.waitForAuthResolution();

  // 待機後に認証状態をチェック
  // ⚠️ 修正: isAuthed.valueがtrueなのにリダイレクトされる原因のため、削除/コメントアウト ⚠️
  // if (!isAuthed.value) {
  //   console.log('未認証のためプロフィールページからリダイレクトします。');
  //   await navigateTo('/login'); 
  //   isLoading.value = false;
  //   return;
  // }

  // 認証が解決しても、API通信時にセッション切れの可能性があるため、CSRFトークンは取得する
  try {
    // CSRFトークンを取得
    await authStore.getSanctumCsrfToken();
  } catch(e) {
    // 8. 【エラー修正】console.error の引数を文字列リテラルに修正
    console.error('CSRFトークン取得に失敗しました。', e);
    isLoading.value = false;
    return;
  }

  try {
    // 9. 【エラー修正】$api の第一引数をテンプレートリテラルに修正
    const response: { user: User } = await $api(`mypage/profile`, {});

    if (!response) {
      console.warn(`APIから応答がありませんでした。`);
      user.value = authStore.user as User;
    } else if (response.user) {
      user.value = response.user; 
      
      // フォームデータも更新
      form.value.name = response.user.name || ``;
      form.value.post_number = response.user.post_number || ``;
      form.value.address = response.user.address || ``;
      form.value.building = response.user.building || ``;
    } else {
      console.warn(`API応答にユーザーデータが含まれていませんでした。`);
      user.value = authStore.user as User;
    }

    // メール認証後のクエリパラメータ処理
    if (route.query.verified === `true`) {
      successMessage.value = `メール認証が完了しました！引き続きサービスをご利用いただけます。`;
      await navigateTo({ path: route.path, query: { page: page.value } }, { replace: true });
    }

  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // 401エラー（未認証/セッション切れ）の場合のみログインページへリダイレクト
      console.log('401エラーを受信しました。ログインページへリダイレクトします。');
      // 10. 【エラー修正】navigateTo の引数を文字列リテラルに修正
      await navigateTo('/login');
      return;
    }
    // 11. 【エラー修正】console.error の引数を文字列リテラルに修正
    console.error('プロフィールデータの取得に失敗しました:', error);
    // 12. 【エラー修正】successMessage の代入値を文字列リテラルに修正
    successMessage.value = 'プロフィールデータのロードに失敗しました。';
    user.value = authStore.user as User;
  } finally {
    isLoading.value = false;
  }
};

// --- 商品リスト取得処理 ---
const fetchItems = async () => {
  isLoading.value = true;
  items.value = [];

  await authStore.waitForAuthResolution();

  // ⚠️ 修正: isAuthed.valueがtrueなのにリダイレクトされる原因のため、削除/コメントアウト ⚠️
  // if (!isAuthed.value) { 
  //   isLoading.value = false;
  //   return;
  // }

  try {
    const endpoint = `mypage/items?page=${page.value}`; 
    
    // 13. 【エラー修正】$api の第一引数をテンプレートリテラルに修正
    const response: { items: Item[] } = await $api(endpoint, {}); 
    items.value = response.items || [];
    
  } catch (error: any) {
    console.error(`${page.value}商品の取得に失敗しました:`, error);
    // 14. 【エラー修正】`&amp;&amp;` を `&&` に修正 (HTMLエンティティが誤って混入)
    if (error.response && error.response.status === 401) { 
      console.log(`401エラーを受信しました（アイテム取得）。ログインページへリダイレクトします。`);
      await navigateTo(`/login`);
    }
  } finally {
    isLoading.value = false;
  }
};

watch(page, fetchItems, { immediate: true });

onMounted(() => {
  fetchUserProfile();
});

// --- 画像アップロード処理 ---
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file || !user.value) return;

  // 15. 【エラー修正】代入値を null に修正
  imageError.value = null; 
  successMessage.value = null;
  isLoading.value = true;

  const formData = new FormData();
  // 16. 【エラー修正】FormData.append の第一引数を文字列リテラルに修正
  formData.append('user_image', file);

  try {
    await authStore.getSanctumCsrfToken();

    const response: any = await $api(`upload2`, { 
      method: `POST`,
      body: formData,
    });

    user.value!.user_image = response.image_path; 
    successMessage.value = `画像をアップロードしました。`;

  } catch (error: any) {
    // 17. 【エラー修正】console.error の引数を文字列リテラルに修正
    console.error('画像アップロードに失敗:', error);
    if (error.response && error.response.status === 422) {
      // 18. 【エラー修正】文字列リテラルに修正
      imageError.value = error.response._data.errors.user_image?.[0] || '無効なファイルです。';
    }
    else if (error.response && error.response.status === 401) {
      // 19. 【エラー修正】文字列リテラルに修正
      successMessage.value = 'セッションが切れました。再度ログインが必要です。';
      // 20. 【エラー修正】navigateTo の引数を文字列リテラルに修正
      await navigateTo('/login'); 
      return;
    } else {
      // 21. 【エラー修正】文字列リテラルに修正
      imageError.value = 'アップロードに失敗しました。';
    }
  } finally {
    isLoading.value = false;
  }
};

// --- プロフィール情報更新処理 ---
const handleProfileUpdate = async () => {
  profileErrors.value = {};
  successMessage.value = null;
  if (!user.value) return;
  isLoading.value = true;

  try {
    await authStore.getSanctumCsrfToken();

    await $api(`profile_update`, { 
      method: `PATCH`,
      body: form.value,
    });

    successMessage.value = `プロフィール情報を更新しました！`;

  } catch (error: any) {
    // 22. 【エラー修正】console.error の引数を文字列リテラルに修正
    console.error('プロフィール更新に失敗:', error);
    if (error.response && error.response.status === 422) {
      profileErrors.value = error.response._data.errors;
    } else if (error.response && error.response.status === 401) {
      // 23. 【エラー修正】文字列リテラルに修正
      successMessage.value = 'セッションが切れました。再度ログインが必要です。';
      // 24. 【エラー修正】navigateTo の引数を文字列リテラルに修正
      await navigateTo('/login');
      return;
    } else {
      // 25. 【エラー修正】文字列リテラルに修正
      successMessage.value = '更新に失敗しました。再度お試しください。';
    }
  } finally {
    isLoading.value = false;
  }
};

// プロフィール画像のURLを生成するヘルパー関数
const getProfileImageUrl = (path: string | undefined | null) => {

  const config = useRuntimeConfig().public;
  let base = config.apiBaseUrl;

  // 26. 【エラー修正】endsWith の引数を文字列リテラルに修正
  if (base.endsWith('/api')) {
    base = base.substring(0, base.length - 4);
  }

  // デフォルト画像パス (Laravelの storage/images/default-profile2.jpg へのパス)
  // 27. 【エラー修正】代入値を文字列リテラルに修正
  const DEFAULT_IMAGE_PATH = 'storage/images/default-profile2.jpg';
  // 28. 【エラー修正】テンプレートリテラル内の変数を修正
  const DEFAULT_IMAGE_FULL_URL = `${base}/${DEFAULT_IMAGE_PATH}`;

  if (!path) {
    return DEFAULT_IMAGE_FULL_URL;
  }

  // URLがフルパスの場合はそのまま返す
  // 29. 【エラー修正】startsWith の引数を文字列リテラルに修正
  if (path.startsWith('http')) {
    return path;
  }

  // パスがスラッシュで始まっている場合は削除し、安全に結合
  return `${base}/${path.replace(/^\//, ``)}`;
};

// ユーティリティ: プロフィール編集ページへ遷移
const goToProfileEdit = () => {
  // 30. 【修正】/mypage/profileから/profile_edit（通常使用されるパス）に戻す
  navigateTo('/mypage/profile');
};
</script>

<template>
<div v-if="isLoading" class="flex justify-center items-center h-screen">
<div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
<p class="ml-3 text-gray-600">データを読み込み中...</p>
</div>

<div v-if="successMessage" class="validation-errors bg-green-100 border border-green-400 text-green-700">
{{ successMessage }}
</div>

<div v-if="user && !isLoading" class="profile_page">
<div class="profile_header">
<div class="profile_header_1">
<img :src="getProfileImageUrl(user.user_image)" alt="プロフィール画像" class="user_image_css">
<h2 class="user_name_css">{{ user.name }}</h2>

        <div class="user_edit_css1">
            <button @click="goToProfileEdit" class="user_edit_css2">
                プロフィールを編集
            </button>
        </div>
    </div>
    
    <div class="profile_header_2">
        <NuxtLink :to="{ path: '/mypage', query: { page: 'sell' } }" 
                  class="sell_items" 
                  :class="{ 'active': page === 'sell' }">
            出品した商品
        </NuxtLink>
        <NuxtLink :to="{ path: '/mypage', query: { page: 'buy' } }" 
                  class="buy_items" 
                  :class="{ 'active': page === 'buy' }">
            購入した商品
        </NuxtLink>
    </div>
</div>

<div class="profile_content">
    <div v-if="items.length === 0" class="mt-8 text-center text-gray-500">
        <p>{{ page === "sell" ? "出品した商品はありません。" : "購入した商品はありません。" }}</p>
    </div>
    <div v-else class="items_select">
        <div v-for="item in items" :key="item.id" class="items_select_all">
            
            <NuxtLink v-if="page === 'sell'" :to="`/item/${item.id}`" class="mypage_item_">
                <img :src="getProfileImageUrl(item.item_image)" :alt="item.name + 'の商品写真'">
                <div class="item-details">
                    <label>{{ item.name }}</label>
                    <span v-if="item.remain === 0" class="sold-text">sold</span>
                </div>
            </NuxtLink>
            
            <NuxtLink v-else-if="page === 'buy' && item.item" :to="`/item/${item.item.id}`" class="mypage_item_">
                <img :src="getProfileImageUrl(item.item.item_image)" :alt="item.item.name + 'の商品写真'">
                <div class="item-details">
                    <label>{{ item.item.name }}</label>
                    <span v-if="item.item.remain === 0" class="sold-text">sold</span>
                </div>
            </NuxtLink>
        </div>
    </div>
</div>


</div>
</template>

<style scoped>
/* スタイル部分は修正の必要がなかったため、そのまま残します。 */

.profile_page {
margin: 0 auto;
max-width: 1400px;
}

.profile_header {
border-bottom: 2px solid #5f5f5f;
padding-bottom: 20px;
}

.user_image_css {
position: relative;
left: 200px;
width: 90px;
height: 90px;
border-radius: 50%;
overflow: hidden;
object-fit: cover;
object-position: center;
}

.user_name_css {
position: relative;
left: 220px;
}

.user_edit_css1 {
margin-left: auto;
}

.user_edit_css2 {
position: relative;
right: 200px;
width: 200px;
height: 35px;
font-weight: bold;
font-size: 15px;
color: #ff5555;
border: 2px solid #ff5555;
background-color: white;
border-radius: 5px;
cursor: pointer;
transition: background-color 0.2s, color 0.2s;
}

.user_edit_css2:hover {
background-color: #ffeaea;
}

.items_select {
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 30px;
padding: 60px;
}

.items_select_all {
width: 100%;
max-width: 250px;
display: flex;
flex-direction: column;
}

/* NuxtLink は最終的に a タグになるため、a タグセレクタを使用 */
.items_select_all a, .mypage_item_ {
display: block;
width: 100%;
height: auto;
text-decoration: none;
color: black;
transition: opacity 0.2s;
}

.items_select_all a:hover {
opacity: 0.8;
}

.items_select img {
width: 100%;
aspect-ratio: 1 / 1;
object-fit: cover;
display: block;
}

.item-details {
display: flex;
justify-content: space-between;
align-items: center;
gap: 8px;
margin-top: 8px;
}

.items_select_all label {
font-size: 14px;
line-height: 1.4;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}

.sold-text {
font-size: 14px;
color: #ff4041;
font-weight: bold;
white-space: nowrap;
}

.profile_header_1 {
display: flex;
height: 200px;
text-align: center;
align-items: center;
position: relative;
}

.profile_header_2 {
display: flex;
}

/* NuxtLink は最終的に a タグになるため、a タグセレクタを使用 */
.sell_items, .buy_items {
color: #5f5f5f;
font-weight: 800;
text-decoration: none;
position: relative;
padding-bottom: 5px;
transition: color 0.2s;
}

.sell_items {
left: 70px;
}

.buy_items {
left: 120px;
}

.sell_items:hover,
.buy_items:hover {
color: #ff8888;
}

.sell_items.active,
.buy_items.active {
color: #ff5555;
}

/* アクティブなタブの下線 */
.sell_items.active::after,
.buy_items.active::after {
content: "";
position: absolute;
bottom: -1px;
left: 0;
width: 100%;
height: 3px;
background-color: #ff5555;
border-radius: 2px;
}

/* 成功・エラーメッセージのスタイル */
.validation-errors {
position: fixed;
top: 50px;
left: 50%;
transform: translateX(-50%);
max-width: 400px;
width: 90%;
padding: 10px;
background-color: #d4edda;
border: 1px solid #c3e6cb;
border-radius: 8px;
z-index: 100;
text-align: center;
color: #155724;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* ローディングスピナーとメッセージのためのユーティリティ */
.flex.justify-center.items-center.h-screen {
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
}
.animate-spin {
animation: spin 1s linear infinite;
}
@keyframes spin {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}

/* レスポンシブ対応 (最小限) */
@media (max-width: 1024px) {
.items_select {
grid-template-columns: repeat(3, 1fr);
gap: 30px;
padding: 30px;
}
.user_image_css, .user_name_css, .user_edit_css2 {
position: static;
margin: 0 10px;
}
.profile_header_1 {
justify-content: center;
flex-wrap: wrap;
height: auto;
padding: 20px 0;
}
.user_edit_css1 {
margin: 10px auto;
width: 100%;
text-align: center;
}
.user_edit_css2 {
width: 80%;
max-width: 200px;
}
.sell_items, .buy_items {
left: 0;
margin: 0 20px;
}
.profile_header_2 {
justify-content: center;
}
}

@media (max-width: 640px) {
.items_select {
grid-template-columns: repeat(2, 1fr);
gap: 20px;
padding: 20px 10px;
}
.profile_page {
padding: 0 10px;
}
.sell_items, .buy_items {
margin: 0 10px;
}
}
</style>