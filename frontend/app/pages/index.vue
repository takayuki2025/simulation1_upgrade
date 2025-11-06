<template>
  <div class="main_contents">
    <!-- ... (中略: タブ切り替え、検索フォーム) ... -->

    <!-- ローディング状態 -->
    <!-- 💡 isPageLoading を使用: 商品データロード中、またはマイリストタブで認証確認中の場合にローディングを表示 -->
    <div v-if="isPageLoading" class="flex justify-center items-center h-48">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-t-4 border-red-500 border-opacity-25 border-t-red-500"></div>
      <p class="ml-4 text-lg text-gray-600">{{ currentTab.value === 'mylist' ? '認証状態を確認中...' : '商品を読み込み中...' }}</p>
    </div>

    <div v-else>
      <!-- ... (中略: タブ切り替え) ... -->
        <div class="main_select">
            <NuxtLink 
              :to="{ query: { tab: 'all', all_item_search: currentSearchQuery || undefined } }" 
              :class="['recs', { active: currentTab === 'all' }]"
              >
              すべて
            </NuxtLink>
            <NuxtLink 
              :to="{ query: { tab: 'mylist', all_item_search: currentSearchQuery || undefined } }" 
              :class="['mylists', { active: currentTab === 'mylist' }]"
              >
              マイリスト
            </NuxtLink>
        </div>

        <div class="items_select">
          <!-- 商品リストの表示 -->
          <template v-if="items.length > 0">
            <div v-for="item in items" :key="item.id" class="items_select_all">
              <NuxtLink :to="`/item/${item.id}`">
                <div class="relative">
                  <img 
                    :src="getImageUrl(item.item_image)" 
                    :alt="item.name"
                    @error="onImageError($event, item.name)"
                  />
                  <!-- remainが0の場合にSOLDタグを表示 -->
                  <div v-if="item.remain === 0" class="sold-text">SOLD</div>
                </div>
                <div class="item-info">
                  <p class="item-name">{{ item.name }}</p>
                  <p class="item-price font-bold text-red-500 text-lg mt-1">
                    &yen;{{ item.price ? item.price.toLocaleString() : '---' }}
                  </p>
                </div>
              </NuxtLink>
            </div>
          </template>
          <div v-else class="text-center w-full py-10 text-gray-500">
            <p>{{ currentTab.value === 'mylist' && !isLoggedIn ? 'マイリストを見るにはログインしてください。' : '該当する商品が見つかりませんでした。' }}</p>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { $fetch } from "ofetch";

definePageMeta({
  layout: 'default',
});

// =======================================================
// 認証ストアの取得と状態
// =======================================================
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isLoggedIn = computed(() => authStore.isAuthenticated); 
// authStore.isLoading は !authStore.isAuthResolved のエイリアス

// =======================================================
// runtimeConfig から API_BASE_URL, ASSET_BASE_URL を取得
// =======================================================
const config = useRuntimeConfig();
const ASSET_BASE_URL = config.public.assetBaseUrl;
const API_BASE_URL = config.public.apiBaseUrl;


// =======================================================
// 型定義 (変更なし)
// =======================================================

interface Item {
  id: number;
  name: string;
  price: number | null;
  item_image: string | null;
  remain: number;
}

// =======================================================
// 状態管理
// =======================================================

const currentTab = computed(() =>
  route.query.tab === "mylist" ? "mylist" : "all"
);
const currentSearchQuery = computed(
  () => (route.query.all_item_search as string) || ""
);

const items = ref<Item[]>([]);
const loading = ref(true); // ★ 商品データのロード状態 (true: ロード中, false: 完了)
const placeholderImageUrl = 'https://placehold.co/300x300/e0e0e0/333?text=No+Image';

// =======================================================
// テンプレートの v-if/v-else の判断に使用する computed
// =======================================================

const isPageLoading = computed(() => {
    // 1. 商品データ自体をロード中であれば、ロード中と見なす
    if (loading.value) return true; 

    // 2. マイリスト表示時、かつ、まだ認証状態が確定していない場合は、ロード中と見なす
    //    (authStore.isLoading は !authStore.isAuthResolved の状態)
    if (currentTab.value === 'mylist' && authStore.isLoading) {
        return true;
    }

    // それ以外の場合はロード完了 (allタブでauthStore.isLoadingがtrueでも、データがあれば表示する)
    return false;
});


// =======================================================
// ヘルパー関数 (変更なし)
// =======================================================

/**
 * APIから返された画像パスを、外部アクセス可能なフルURLに変換する
 */
const getImageUrl = (path: string | null): string => {
  if (!path) {
    return placeholderImageUrl;
  }
  
  if (path.startsWith('http')) {
    return path;
  }
  
  const baseUrl = ASSET_BASE_URL.endsWith('/') ? ASSET_BASE_URL.slice(0, -1) : ASSET_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  return `${baseUrl}/${normalizedPath}`;
};

/**
 * 画像読み込みエラー発生時の処理 (商品名入りのプレースホルダーに置き換え)
 */
const onImageError = (e: Event, itemName: string) => {
  const target = e.target as HTMLImageElement;
  target.onerror = null;
  const placeholderText = itemName ? itemName.replace(/\s/g, '+') : 'Error';
  target.src = `https://placehold.co/300x300/e0e0e0/333?text=${placeholderText}`;
};

// =======================================================
// データフェッチロジック (API連携)
// =======================================================

const fetchItems = async (tab: string, search: string) => {
  
  // ★ 修正: 未ログインの場合はリダイレクトせず、APIコールをスキップしてUIにメッセージを表示させる
  if (tab === 'mylist' && !isLoggedIn.value) {
    console.log("[Skip Fetch] Not logged in and accessing mylist. Showing login message in UI.");
    items.value = []; // リストを空にする
    loading.value = false;
    return; // APIコールを実行せずに終了
  }
  
  loading.value = true;
  console.log(`[Fetch] LoggedIn State: ${isLoggedIn.value}. Fetching items: tab=${tab}, search=${search}`);

  const apiUrl = `${API_BASE_URL}/items`;

  try {
    const response = await $fetch(apiUrl, {
      query: { 
        tab: tab, 
        all_item_search: search,
      },
      credentials: 'include',
    });

    const responseData = response as any;
    
    if (responseData && Array.isArray(responseData.items)) {
        items.value = responseData.items as Item[];
        console.log("Fetched Items data structure:", items.value.slice(0, 3)); 
    } else {
        console.warn("APIレスポンスの構造が不正です:", responseData);
        items.value = [];
    }

    console.log(`Fetched ${items.value.length} items successfully.`);

  } catch (e: any) {
    if (e.response && e.response.status === 401 && tab === 'mylist') {
        console.error("マイリストの取得中に認証エラー(401)が発生しました。トークン有効期限切れの可能性。");
        // 401が返された場合は、ログアウト状態とみなし、リダイレクトする (こちらは残す)
        router.push({ path: '/login' });
    } else {
        console.error("商品の取得中に予期せぬエラーが発生しました:", e);
    }
    items.value = []; 
  } finally {
    loading.value = false;
  }
};

// =======================================================
// Watcher: URLクエリとログイン状態の変更を監視し、データを再取得
// =======================================================

// 1. URLクエリの変更を監視
watch(
  () => route.query,
  async (newQuery) => { // ★ async を追加
    const nextTab = newQuery.tab === "mylist" ? "mylist" : "all";
    const nextSearch = (newQuery.all_item_search as string) || "";

    // マイリストに切り替える際、認証がまだ解決中でない場合は待機する
    if (nextTab === 'mylist' && authStore.isLoading) {
        console.log("[Watcher] MyList selected, waiting for auth resolution...");
        // 認証解決を待つ
        await authStore.waitForAuthResolution();
        console.log("[Watcher] Auth resolved. Proceeding to fetch.");
    }

    fetchItems(nextTab, nextSearch);
  },
  { deep: true }
);

// 2. ログイン状態の変更を監視 
watch(isLoggedIn, (newStatus, oldStatus) => {
  // 初回ロード時（oldStatusがundefinedなどの場合）は onMounted に任せる
  if (oldStatus !== undefined && oldStatus !== newStatus) {
    console.log(`[Watcher] LoggedIn status changed from ${oldStatus} to ${newStatus}. Re-fetching items.`);
    
    // ログイン/ログアウトが発生したら、現在のタブとクエリで再フェッチ
    fetchItems(
      currentTab.value,
      currentSearchQuery.value
    );
  }
});

// 3. コンポーネントロード時に初回フェッチを実行
onMounted(async () => { // ★ async を追加
    // 認証状態の解決を待機する (isLoadingがfalseになるまで)
    console.log("[onMounted] Waiting for auth resolution...");
    await authStore.waitForAuthResolution(); 
    console.log("[onMounted] Auth resolved. Proceeding to fetch items.");

    fetchItems(
      currentTab.value,
      currentSearchQuery.value
    );
});
</script>

<style scoped>
/* ... (CSSは変更なし) ... */
.main_contents {
  margin: 0 auto;
  max-width: 1400px;
  padding: 0 20px;
}

.main_select {
  height: 80px;
  border-bottom: 3px solid #afafaf;
  position: relative;
  display: flex;
  align-items: center; /* 垂直方向中央寄せ */
  justify-content: flex-start;
  padding-left: 100px;
  gap: 50px;
}

.recs,
.mylists {
  text-decoration: none;
  color: #999;
  font-size: 1.2rem;
  font-weight: bold;
  /* 垂直中央に合わせるため、padding-bottomを調整 */
  padding-bottom: 15px; 
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

/* ホバーとアクティブのスタイルはそのまま維持 */
.recs:hover,
.mylists:hover {
  color: #666;
}

.recs.active,
.mylists.active {
  color: #ff4041;
  border-bottom: 3px solid #ff4041;
}

.items_select {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 40px;
  padding: 80px 0;
}

/* 4列レイアウトの調整 (モバイル対応も考慮) */
.items_select_all {
  flex: 0 0 calc(25% - 30px);
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* モバイル向け調整 */
@media (max-width: 1024px) {
  .items_select_all {
    flex: 0 0 calc(33.33% - 26.67px);
  }
}

@media (max-width: 640px) {
  .items_select_all {
    flex: 0 0 calc(50% - 20px);
  }
  .main_select {
    justify-content: flex-start; 
    padding-left: 20px; 
    gap: 30px;
  }
}

.items_select_all a {
  display: block;
  width: 100%;
}

.items_select img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.item-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 8px;
  position: relative;
  min-height: 40px;
}

.item-name {
  margin: 0;
  max-width: 100%;
  word-wrap: break-word;
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}

/* soldタグを画像の上に重ねるためのスタイル */
.items_select_all {
  position: relative;
}
.items_select_all .sold-text {
  position: absolute;
  /* 画像に重ねて中央付近に表示 */
  top: 50%; 
  left: 50%;
  transform: translate(-50%, -50%) rotate(-10deg); 
  z-index: 10;
  font-size: 1.5rem; 
  color: #ff4041;
  font-weight: 900;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 4px solid #ff4041;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  pointer-events: none; /* クリックを透過させる */
}
</style>