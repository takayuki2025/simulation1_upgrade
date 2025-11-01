<template>
  <!-- min-h-screen: 画面の高さいっぱい, bg-gray-100: 背景色 -->
  <div class="auth-wrapper mx-auto max-w-content bg-white shadow-xl min-h-screen">
    
    <header class="header bg-black shadow-md mx-auto max-w-content">
      <div class="header__inner flex justify-between items-center py-3 px-4">
        <NuxtLink to="/">
          <img class="h-8 w-auto company" src="/image_icon/logo.svg" alt="会社名"> 
        </NuxtLink>
      </div>
    </header>
    
    <!-- Main Content: 中央寄せのコンテナ -->
    <main class="flex items-center justify-center pt-10 px-4">
      <slot />
    </main>
    
  </div>
</template>

<script setup lang="ts">
// 💡 useHeaderStateからロジックをインポートしますが、このレイアウトでは
//    isAuthPageが常にtrueなので、ロジック自体は使用せず、依存関係を満たすためだけにインポート
import { useHeaderState } from '../composables/useHeaderState';
const { isLoggedIn, isLoading, handleLogout, handleSearch } = useHeaderState();
// 変数を定義することで、テンプレート内でロジックが必要な場合に備える（今回はヘッダーHTMLにロジックが無いため不要）
</script>

<style scoped>
/*
以前のカスタムCSSを削除し、Tailwind CSSを優先します。
min-heightを調整して、ヘッダーの高さを考慮に入れます（h-16 = 64px を想定）
*/
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

main {
  /* min-h-screen からヘッダーの高さ (約64px) を引く */
  min-height: calc(100vh - 64px); 
}
</style>