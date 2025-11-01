<template>
  <NuxtLayout>
    <!-- pages/index.vue を作成したので、これでページルーティングが機能します -->
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

// グローバルなメタ情報などを設定
useHead({
  title: 'Laravel & Nuxt 認証連携',
  meta: [
    { name: 'description', content: 'Laravel API と Nuxt で構築された認証アプリケーション' }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' }
  ]
});

// アプリケーション起動時に認証状態をチェック
onMounted(() => {
  // onMounted の中で実行することで、Piniaが確実にアクティブになった後でストアが利用可能になることを期待します。
  // const authStore = useAuthStore(); 
  // authStore.checkAuthStatus();
});

// <Suspense> 警告を誘発していた可能性のある最上位の await を削除しました
// これで <Suspense> に関する警告は解消されるはずです。

</script>