<template>
  <!-- max-w-7xl mx-auto は Blade の .profile_page max-width: 1400px を再現 -->
  <!-- レイアウト 'default' が適用されるため、このコンテナはレイアウトコンポーネント内の一部になります -->
  <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 font-sans">
    
    <!-- ローディング状態 -->
    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-red-500"></div>
      <p class="ml-4 text-xl text-gray-600">データを読み込み中...</p>
    </div>

    <!-- エラー状態 -->
    <div v-else-if="error" class="p-8 text-center text-red-600 font-bold bg-red-50 border border-red-300 rounded-lg mx-auto max-w-md">
      {{ error }}
    </div>

    <!-- メインコンテンツ -->
    <div v-else-if="user" class="profile_page">
      
      <!-- プロフィールヘッダー -->
      <div class="profile_header border-b-2 border-gray-500 pb-5 mb-8">
        <div class="profile_header_1 flex items-center justify-start h-48 relative">
          
          <!-- 画像と名前のコンテナ (元のCSSの絶対位置指定を Flexbox で再現) -->
          <div class="flex items-center absolute left-0 right-0 justify-center w-full">
             <div class="flex items-center" style="margin-left: -140px;"> <!-- 画像と名前の全体を左に寄せる調整 -->
                <!-- ユーザー画像 -->
                <img 
                  :src="userImageUrl" 
                  alt="プロフィール画像" 
                  class="user_image_css w-[90px] h-[90px] rounded-full object-cover object-center shadow-md border-4 border-white ring-1 ring-gray-300"
                  @error="onImageError"
                />
                
                <!-- ユーザー名 -->
                <h2 class="user_name_css text-2xl font-bold text-gray-800 ml-5">{{ user.name }}</h2>
             </div>
          </div>

          <!-- プロフィール編集ボタン (元のCSSの右寄せを ml-auto と absolute で再現) -->
          <div class="absolute right-[200px]">
            <NuxtLink to="/profile_edit" class="user_edit_css1">
              <button 
                type="button" 
                class="user_edit_css2 w-[200px] h-[35px] font-bold text-base text-red-500 border-2 border-red-500 bg-white rounded-md hover:bg-red-50 transition duration-150 shadow-sm"
              >
                プロフィールを編集
              </button>
            </NuxtLink>
          </div>
        </div>

        <!-- タブ切り替え -->
        <div class="profile_header_2 flex justify-start space-x-12 mt-6" style="margin-left: 70px;">
          <!-- リンク先を /mypages?page=... に変更 -->
          <NuxtLink 
            to="/mypages?page=sell" 
            :class="['sell_items text-xl font-extrabold pb-1 transition duration-150', currentPage === 'sell' ? 'active text-red-500 border-b-4 border-red-500' : 'text-gray-500 hover:text-red-400']"
            replace
          >
            出品した商品
          </NuxtLink>
          <NuxtLink 
            to="/mypages?page=buy" 
            :class="['buy_items text-xl font-extrabold pb-1 transition duration-150', currentPage === 'buy' ? 'active text-red-500 border-b-4 border-red-500' : 'text-gray-500 hover:text-red-400']"
            replace
          >
            購入した商品
          </NuxtLink>
        </div>
      </div>

      <!-- 商品コンテンツ -->
      <div class="profile_content">
        <div v-if="items.length === 0" class="py-16">
            <p class="text-center text-lg text-gray-500">
                {{ currentPage === 'sell' ? '出品した商品はありません。' : '購入した商品はありません。' }}
            </p>
        </div>
        <div v-else class="items_select grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 p-4 md:p-12">
            <div v-for="itemWrapper in items" :key="itemWrapper.id" class="items_select_all">
                <ItemCard 
                    :item="currentPage === 'sell' ? itemWrapper : itemWrapper.item" 
                />
            </div>
        </div>
      </div>
    </div>
    
    <!-- 認証情報がない場合 -->
    <div v-else class="p-8 text-center text-gray-500">
      認証情報がありません。ログインしてください。
    </div>
  </div>
</template>

<script setup>
// ====================================================================
// definePageMeta でレイアウトとミドルウェアを設定
// ====================================================================
definePageMeta({
  // middleware: 'auth', // 認証ミドルウェアを使用する場合
  layout: 'default', // default.vue レイアウトを適用
});

import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 🚨 useRuntimeConfig をインポートして環境変数を取得
const config = useRuntimeConfig();
const ASSET_BASE_URL = config.public.assetBaseUrl;

// Nuxt RouteとRouterを取得
const route = useRoute();
const router = useRouter();

// ページの状態
const currentPage = computed(() => route.query.page || 'sell');

// データ状態
const user = ref(null);
const items = ref([]);
const isLoading = ref(true);
const error = ref(null);

// 画像読み込みエラー時の処理
const onImageError = (e) => {
  e.target.onerror = null;
  // Nuxt側のローカルアセットを使う場合は /_nuxt/assets/images/default-profile2.jpg
  // 今回は相対パスで、もしNuxtが静的ファイルとして持っている前提ならそのまま
  e.target.src = '/storage/images/default-profile2.jpg'; 
};

// ユーザー画像URLの組み立て (ASSET_BASE_URL を適用)
const userImageUrl = computed(() => {
    const path = user.value?.user_image;

    if (path) {
        // 1. フルURLが返ってきた場合 (http://...) はそのまま使う
        if (path.startsWith('http')) {
            return path;
        }
        
        // 2. 相対パス (例: /storage/images/user_a.jpg) が返ってきた場合
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        
        // ASSET_BASE_URL (http://localhost) と結合
        return `${ASSET_BASE_URL}${normalizedPath}`;
    }
    // デフォルト画像（NuxtのアセットまたはWebサーバーのルートに置く前提）
    return '/storage/images/default-profile2.jpg';
});


// プロフィールデータとアイテムリストのフェッチ
const fetchProfileData = async (page) => {
    isLoading.value = true;
    error.value = null;
    try {
        // バックエンドのLaravel APIエンドポイントを呼び出す
        // $fetchは runtimeConfig.public.apiUrl (http://nginx) をベースに使う
        const response = await $fetch(`/api/mypage/profile?page=${page}`);
        
        user.value = response.user;
        items.value = response.items;
    } catch (e) {
        console.error("プロフィールデータの取得中にエラーが発生しました:", e);
        if (e.response?.status === 401) {
             error.value = 'ログインしてください。';
        } else {
             error.value = 'データの読み込みに失敗しました。';
        }
        user.value = null; // 失敗時はユーザー情報をリセット
        items.value = [];
    } finally {
        isLoading.value = false;
    }
};

// ルートクエリパラメータが変更されたとき、データを再取得
watch(currentPage, (newPage) => {
    fetchProfileData(newPage);
}, { immediate: true }); // コンポーネントロード時にも即時実行

// ====================================================================
// ItemCard コンポーネント (内部コンポーネントとして定義)
// ====================================================================
const ItemCard = {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const displayItem = computed(() => props.item);
        const sold = computed(() => displayItem.value?.remain === 0);

        // 🚨 ItemCard内でもASSET_BASE_URLを使って画像URLを組み立てる
        const itemImageUrl = computed(() => {
            const path = displayItem.value?.item_image;
            if (path) {
                if (path.startsWith('http')) {
                    return path;
                }
                const normalizedPath = path.startsWith('/') ? path : `/${path}`;
                return `${ASSET_BASE_URL}${normalizedPath}`;
            }
            // プレースホルダー画像
            return 'https://placehold.co/250x250/cccccc/333333?text=No+Image';
        });

        const onItemImageError = (e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/250x250/cccccc/333333?text=No+Image';
        };

        return {
            displayItem,
            sold,
            itemImageUrl,
            onItemImageError
        };
    },
    template: `
        <NuxtLink :to="'/item/' + displayItem.id" class="mypage_item_ group block w-full text-black no-underline">
            <div class="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                <!-- 商品写真 -->
                <img 
                    :src="itemImageUrl" 
                    alt="商品写真" 
                    class="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                    @error="onItemImageError"
                />
                <span v-if="sold" class="absolute top-2 left-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">SOLD</span>
            </div>
            
            <!-- 商品詳細 -->
            <div class="item-details flex justify-between items-center gap-2 mt-2">
                <label class="text-sm font-semibold truncate max-w-[70%]">{{ displayItem.name }}</label>
                <span v-if="sold" class="sold-text text-sm font-bold whitespace-nowrap" style="color: #ff4041;">sold</span>
            </div>
        </NuxtLink>
    `
};

</script>

<!-- ==================================================================== -->
<!-- スコープ付きスタイル (元の CSS を再現するために使用) -->
<!-- ==================================================================== -->
<style scoped>
/* Tailwind CSS を利用して、元のCSSの意図を再現しつつ、不足分を補完 */

.profile_header {
    border-color: #5f5f5f;
}

/* HACK: 元のCSSの絶対配置 (left: 200px, right: 200px) を Flex と relative/absolute でシミュレート */
.profile_header_1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* 出品・購入タブのリンクスタイル */
.sell_items, .buy_items {
    text-decoration: none;
    color: #5f5f5f;
    padding-bottom: 5px;
}

/* アクティブなタブ */
.sell_items.active,
.buy_items.active {
    color: #ff5555;
    border-color: #ff5555;
}

/* プロフィール編集ボタン */
.user_edit_css2 {
    color: #ff5555;
    border: 2px solid #ff5555;
    background-color: white;
    border-radius: 5px;
    transition: all 0.2s;
}
.user_edit_css2:hover {
    background-color: #ffe0e0;
    box-shadow: 0 4px 6px rgba(255, 85, 85, 0.2);
}

/* 商品一覧のレイアウト */
.items_select {
    padding: 3rem;
}

/* レスポンシブデザインの調整 (Tailwindのブレイクポイントを使用) */
@media (max-width: 768px) {
    .items_select {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        padding: 1rem;
    }
    .profile_header_1 {
        flex-direction: column;
        height: auto;
        padding: 20px 0;
    }
    .profile_header_1 > * {
        position: static !important;
        margin: 0 !important;
    }

    .user_image_css {
        margin-bottom: 10px;
    }
    .user_edit_css2 {
        margin-top: 15px;
    }
    .profile_header_2 {
        justify-content: center;
        margin-left: 0 !important;
    }
    .profile_header_2 a {
        position: static !important;
        margin: 0 10px;
    }
}
</style>