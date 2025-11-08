<template>
  <!-- サイト全体のラッパー -->
  <div class="site-wrapper mx-auto max-w-content bg-white shadow-xl min-h-screen">
    
    <!-- 
      【重要な修正点】
      App.vueが認証解決(isAuthResolved)を待って全画面をブロックする役割を担っているため、
      レイアウトファイル内では、isAuthResolvedのチェックとローディング表示は不要です。
      App.vueがtrueになった後で、このファイルがレンダリングされます。
    -->
    
    <!-- 2. ヘッダーとコンテンツを表示 -->
    
    <!-- ヘッダー部分 -->
    <header class="header bg-black shadow-md mx-auto max-w-content">
      <div class="header__inner flex justify-between items-center py-3 px-4">
        
        <NuxtLink to="/">
          <img class="h-8 w-auto company" src="/image_icon/logo.svg" alt="会社名"> 
        </NuxtLink>
        
        <!-- 検索フォーム -->
        <form @submit.prevent="handleSearch" class="flex-grow max-w-lg mx-8 hidden md:block">
          <input 
            v-model="searchQuery"
            type="text" 
            class="search_form w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150" 
            placeholder="　なにをお探しですか？"
          />
        </form>

        <div class="login_page0 flex space-x-4 items-center ml-auto">
          
          <!-- 認証が完了している場合の表示 (authStore.user の有無で判断) -->
          <template v-if="authStore.user">
            <!-- ログイン済みユーザー向け (ログアウト、マイページ、出品) -->
            <button @click="handleLogout" class="login_page_1 text-white hover:text-red-500 transition duration-150 text-sm">
              ログアウト
            </button>
            
            <NuxtLink to="/mypage" class="login_page_2 text-white hover:text-red-500 transition duration-150 text-sm">
              マイページ
            </NuxtLink>
            
            <NuxtLink to="/sell" class="login_page_3 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition duration-150 text-sm font-semibold">
              出品
            </NuxtLink>

          </template>
          <template v-else>
            <!-- 未ログインユーザー向け (ログイン、新規登録、出品/ログインへ) -->
            <NuxtLink to="/login" class="login_page_1 text-white hover:text-red-500 transition duration-150 text-sm">
              ログイン画面へ
            </NuxtLink>
            <NuxtLink to="/register" class="login_page_2 text-white hover:text-red-500 transition duration-150 text-sm">
              新規登録画面へ
            </NuxtLink>
            <!-- 未ログイン時の出品はログインページへ誘導 -->
            <NuxtLink to="/login" class="login_page_3 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition duration-150 text-sm font-semibold">
              出品（ログイン）
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>
    
    <!-- メインコンテンツ領域 -->
    <main class="main-content min-h-[calc(100vh-64px)] p-4 md:p-8">
      <!-- App.vueで認証解決を待っているため、コンテンツは常に表示されます -->
      <slot />
    </main>

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// 検索フォーム用のローカルな状態
const searchQuery = ref(route.query.all_item_search || "");

// ログアウト処理
const handleLogout = async () => {
  try {
    // authStore.logout() が完了すると authStore.user が null に更新されます。
    await authStore.logout();
    // ログアウト後、ホームにリダイレクト
    router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// 検索処理
const handleSearch = () => {
  const currentTab = route.query.tab || "all";
  router.push({
    path: "/",
    query: {
      tab: currentTab,
      all_item_search: searchQuery.value || undefined, // 空文字の場合はクエリを削除
    },
  });
};
</script>

<style scoped>
/* AppHeader.vueから移植したスタイルと、レイアウトに必要なスタイルを結合 */
.max-w-content {
    max-width: 1400px;
}
.site-wrapper {
  /* ヘッダーコンポーネントとして、影はここで保持してもOKです */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
.company {
    /* imgタグのデフォルトマージンを上書きし、左寄せを確保 */
    margin-left: 0 !important; 
}
.login_page0 {
  white-space: nowrap; 
}
/* 未ログイン時のリンクも白文字で見えるように調整 */
.login_page0 a {
    color: white; 
}
/* ヘッダーの高さに合わせてメインコンテンツの高さを調整（例としてヘッダーを64pxと仮定） */
.main-content {
  /* ヘッダーの高さを考慮して、ビューポートの残りの高さを確保 */
  min-height: calc(100vh - 64px); 
}
</style>