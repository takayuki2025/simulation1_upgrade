<template>
  <div class="site-wrapper mx-auto max-w-content bg-white shadow-xl min-h-screen">
    
    <header class="header bg-black shadow-md mx-auto max-w-content">
      <div class="header__inner flex justify-between items-center py-3 px-4">
        
        <NuxtLink to="/">
          <img class="h-8 w-auto company" src="/image_icon/logo.svg" alt="会社名"> 
        </NuxtLink>
        
        <form @submit.prevent="handleSearch" class="flex-grow max-w-lg mx-8 hidden md:block">
          <input 
            v-model="searchQuery"
            type="text" 
            class="search_form w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150" 
            placeholder="　なにをお探しですか？"
          />
        </form>

        <div class="login_page0 flex space-x-4 items-center ml-auto">
          <template v-if="isLoading">
            <div class="text-white">認証確認中...</div>
          </template>
          <template v-else-if="isLoggedIn">
            <!-- ★★★ ログイン済みユーザー向け (ログアウト、マイページ、出品) ★★★ -->
            <button @click="handleLogout" class="login_page_1 text-white hover:text-red-500 transition duration-150 text-sm">
              ログアウト
            </button>
            
            <NuxtLink to="/mypage?page=sell" class="login_page_2 text-white hover:text-red-500 transition duration-150 text-sm">
              マイページ
            </NuxtLink>
            
            <NuxtLink to="/sell" class="login_page_3 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition duration-150 text-sm font-semibold">
              出品
            </NuxtLink>

          </template>
          <template v-else>
            <!-- ★★★ 未ログインユーザー向け (ログイン、新規登録、出品/ログインへ) ★★★ -->
            <!-- 以前の「ログアウト」位置に「ログイン」ボタンを配置し、ログイン画面へ遷移 -->
            <NuxtLink to="/login" class="login_page_1 text-white hover:text-red-500 transition duration-150 text-sm">
              ログイン画面へ
            </NuxtLink>
            <!-- 以前の「マイページ」位置に「新規登録」ボタンを配置し、新規登録画面へ遷移 -->
            <NuxtLink to="/register" class="login_page_2 text-white hover:text-red-500 transition duration-150 text-sm">
              新規登録画面へ
            </NuxtLink>
            <!-- 出品ボタンは、未ログインの場合ログインページへ誘導 -->
            <NuxtLink to="/login" class="login_page_3 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition duration-150 text-sm font-semibold">
              認証後に出品へ
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>
    
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// 💡 useHeaderStateから必要なロジックをインポート
import { useHeaderState } from '../composables/useHeaderState';

const { isLoggedIn, isLoading, searchQuery, handleLogout, handleSearch } = useHeaderState();
// isAuthPage はこのレイアウトでは常に false のため不要
</script>

<style scoped>
/* AppHeader.vue から移植したスタイル */
.max-w-content {
    max-width: 1400px;
}
.site-wrapper {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
.company {
    margin-left: 0 !important; 
}
.login_page0 {
  white-space: nowrap; 
}
/* AppHeader.vueのスタイルはここに全て移植してください */
/* 未ログイン時のリンクも白文字で見えるように調整 */
.login_page0 a {
    color: white; /* ヘッダーの背景が黒なので、未ログイン時のリンク色を白に統一 */
}
</style>
