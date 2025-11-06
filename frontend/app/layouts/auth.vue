<template>
  <div class="auth-wrapper mx-auto max-w-content bg-white shadow-xl min-h-screen">
    
    <header class="header bg-black shadow-md mx-auto max-w-content">
      <div class="header__inner flex justify-between items-center py-3 px-4">
        <NuxtLink to="/">
          <img class="h-8 w-auto company" src="/image_icon/logo.svg" alt="会社名"> 
        </NuxtLink>
      </div>
    </header>
    
    <main class="flex flex-col items-center justify-start pt-10 px-4">
      
      <div v-if="!authStore.isAuthResolved" class="flex flex-col items-center justify-center h-64 text-gray-500 w-full">
          <svg class="animate-spin h-8 w-8 text-indigo-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-lg text-gray-800">認証サービスを準備中です...</p>
      </div>
      
      <div v-show="authStore.isAuthResolved" class="w-full">
          <slot />
      </div>
      
    </main>
    
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

// Piniaストアを使用
const authStore = useAuthStore();
</script>

<style scoped>
/* カスタムCSSは元の指定を維持 */
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
  /* min-h-screen からヘッダーの高さ (約56px: py-3で決定) を引くことで、適切な垂直スペースを確保 */
  min-height: calc(100vh - 56px); 
}
</style>