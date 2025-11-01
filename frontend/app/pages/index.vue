<template>
  <div class="main_contents">
    <!-- 成功メッセージの表示 (NuxtではLaravelのsessionではなく、別の方法で実装される
        ここでは仮にメッセージを表示するスペースのみ用意 -->
    <!-- <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div> -->
    
    <!-- ローディング状態 -->
    <div v-if="loading" class="flex justify-center items-center h-48">
      <div class="animate-spin rounded-full h-10 w-10 border-b-3 border-red-500"></div>
      <p class="ml-4 text-lg text-gray-600">商品を読み込み中...</p>
    </div>

    <div v-else>
        <div class="main_select">
            <!-- おすすめ (tab=all) -->
            <NuxtLink
              :to="{
                query: {
                  tab: 'all',
                  all_item_search: currentSearchQuery || undefined,
                },
              }"
              class="recs"
              :class="{ active: currentTab === 'all' }"
            >
              おすすめ
            </NuxtLink>

            <!-- マイリスト (tab=mylist) -->
            <NuxtLink
              :to="{
                query: {
                  tab: 'mylist',
                  all_item_search: currentSearchQuery || undefined,
                },
              }"
              class="mylists"
              :class="{ active: currentTab === 'mylist' }"
            >
              マイリスト
            </NuxtLink>
        </div>

        <div class="items_select">
          <!-- 商品リストの表示 -->
          <template v-if="items.length > 0">
            <div v-for="item in items" :key="item.id" class="items_select_all">
              <NuxtLink :to="`/item/${item.id}`">
                <!-- 💡 画像URLを getImageUrl ヘルパー関数で組み立て -->
                <img
                  :src="getImageUrl(item.item_image)"
                  :alt="item.name"
                  @error="(e) => onImageError(e, item.name)"
                />
              </NuxtLink>
              <div class="item-info">
                <!-- 🚨 修正箇所: item.priceが有効な数値であるかをチェック -->
                <p class="item-name">
                  <!-- null/undefined の場合は '---' を表示してクラッシュを回避 -->
                  &yen;{{ typeof item.price === 'number' && item.price !== null
                    ? item.price.toLocaleString()
                    : '---'
                  }} {{ item.name }}
                </p>
                <p v-if="item.remain === 0" class="sold-text">sold</p>
              </div>
            </div>
          </template>
          <div v-else class="text-center w-full py-10 text-gray-500">
            <p>該当する商品が見つかりませんでした。</p>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  layout: 'default',
});

// =======================================================
// 🚨 修正: runtimeConfig から API_BASE_URL も取得
// =======================================================
const config = useRuntimeConfig();
const ASSET_BASE_URL = config.public.assetBaseUrl; // Nuxt.configで設定されているはず
console.log("ASSET_BASE_URL:", ASSET_BASE_URL);
const API_BASE_URL = config.public.apiBaseUrl; // APIのベースURLも取得

const route = useRoute();

// =======================================================
// 型定義
// =======================================================

interface Item {
  id: number;
  name: string;
  price: number | null; // 💡 修正: priceがnullになる可能性を考慮して型に含める
  item_image: string | null; // 画像パスはAPIから来る
  remain: number;
}

// =======================================================
// 状態管理
// =======================================================

// 現在のタブの状態 (URLクエリ 'tab' に連動)
const currentTab = computed(() =>
  route.query.tab === "mylist" ? "mylist" : "all"
);
// 現在の検索クエリ (URLクエリ 'all_item_search' に連動)
const currentSearchQuery = computed(
  () => (route.query.all_item_search as string) || ""
);

const items = ref<Item[]>([]);
const loading = ref(true);

// =======================================================
// ヘルパー関数
// =======================================================

/**
 * APIから返された画像パスを、外部アクセス可能なフルURLに変換する
 * @param path Laravelの /storage/... から始まる相対パス
 * @returns フルURL
 */
const getImageUrl = (path: string | null): string => {
  if (!path) {
    return 'https://placehold.co/300x300/e0e0e0/333?text=No+Imag'; // フォールバックプレースホルダー
  }
  
  // 1. フルURLが返ってきた場合 (http://...) はそのまま使う
  if (path.startsWith('http')) {
    return path;
  }
  
  // 2. 相対パスが返ってきた場合、ASSET_BASE_URL と結合する
  // Laravelのパスは既に "storage/images/..." となっているため、ASSET_BASE_URL (例: http://localhost) と結合する。
  // Nuxt側の設定 (assetBaseUrl) が 'http://localhost' なら、
  // 'http://localhost' + '/' + 'storage/images/...' となる
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path; // 先頭の / を削除
  
  // ASSET_BASE_URL には通常、末尾に / が含まれていないと仮定して / を追加
  return `${ASSET_BASE_URL}/${normalizedPath}`;
};

/**
 * 画像読み込みエラー発生時の処理 (商品名入りのプレースホルダーに置き換え)
 */
const onImageError = (e: Event, itemName: string) => {
  const target = e.target as HTMLImageElement;
  target.onerror = null; // エラーの連鎖を防ぐ
  // 商品名を使ってプレースホルダーを生成 (スペースを + に変換)
  const placeholderText = itemName ? itemName.replace(/\s/g, '+') : 'Error';
  target.src = `https://placehold.co/300x300/e0e0e0/333?text=${placeholderText}`;
};

// =======================================================
// データフェッチロジック (API連携)
// =======================================================

const fetchItems = async (tab: string, search: string) => {
  loading.value = true;
  console.log(`Fetching items: tab=${tab}, search=${search}`);

  // APIの完全なURLを構築
  const apiUrl = `${API_BASE_URL}/items`; // ← API_BASE_URL を明示的に使用

  try {
    // 修正: $fetch を再度使用し、クエリパラメータを渡す
    const response = await $fetch(apiUrl, {
      query: { 
        tab: tab, 
        all_item_search: search,
      },
      // APIリクエストに認証情報が必要な場合はここに追加:
      // headers: { 'Authorization': `Bearer ${token.value}` } 
    });

    // 🚨 修正箇所: Laravel Controllerからのレスポンスは { items: [...] } 形式であるため、
    // response.items を直接参照するロジックに統一します。
    const responseData = response as any;
    
    if (responseData && Array.isArray(responseData.items)) {
        items.value = responseData.items as Item[];
    } else {
        // API側がJSONとしてパースできるレスポンスを返さなかった場合は、
        // $fetchがエラーをスローするため、この警告は主にレスポンス構造が不正な場合に使用される
        console.warn("APIレスポンスの構造が不正です:", responseData);
        items.value = [];
    }

    // 取得したアイテムの数をログに出力
    console.log(`Fetched ${items.value.length} items successfully.`);

  } catch (e) {
    console.error("商品の取得中にエラーが発生しました:", e);
    // エラー時はユーザーに何も見せないか、空のリストを表示
    items.value = []; 
  } finally {
    loading.value = false;
  }
};

// =======================================================
// Watcher: URLクエリの変更を監視し、データを再取得
// =======================================================

// route.query の変更を深く監視
watch(
  () => route.query,
  (newQuery) => {
    fetchItems(
      newQuery.tab === "mylist" ? "mylist" : "all",
      (newQuery.all_item_search as string) || ""
    );
  },
  { immediate: true, deep: true } // コンポーネントロード時に即時実行
);
</script>

<style scoped>
/* =======================================================
   CSS (Bladeテンプレートから移植)
   ======================================================= */
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

  /* 🚨 修正: 左寄せに変更 (Flexboxのデフォルトの挙動) */
  justify-content: flex-start;

  /* 🚨 修正: 左端からのパディングを追加して開始位置を調整 */
  padding-left: 100px;

  /* タブ間のスペース */
  gap: 50px; /* ここは間隔を少し広めに設定しました */
}

.recs,
.mylists {
  text-decoration: none;
  color: #999;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  display: inline-block;
  height: 100%;
  line-height: 80px;
  box-sizing: border-box;
}

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
    /* モバイルでは中央寄せに戻すか、パディングを小さくする */
    justify-content: center; /* または flex-start */
    padding-left: 20px; /* 小さな画面ではパディングを減らす */
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

/* soldタグを画像に重ねるための親要素の調整 */
.items_select_all a {
  position: relative;
}
.items_select_all .sold-text {
  position: absolute;
  bottom: 5px;
  right: 5px;
  z-index: 10;
  font-size: 1.2rem;
  color: #ff4041;
  font-weight: bold;
  padding: 4px 8px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid #ff4041;
  border-radius: 4px;
}
</style>
