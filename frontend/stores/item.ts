import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { $fetch } from "ofetch"; // ofetchを明示的にインポート

// -------------------------------------------------------------------------
// 型定義
// -------------------------------------------------------------------------
interface User {
  id: number;
  name: string;
  user_image?: string;
}

interface Item {
  id: number;
  user_id: number;
  name: string;
  price: number;
  brand: string | null;
  explain: string;
  condition: string;
  category: string | string[];
  item_image: string;
  remain: number;
  user: User;
}

interface Comment {
  id: number;
  item_id: number;
  user_id: number;
  comment: string;
  created_at: string;
  user: User;
}

// -------------------------------------------------------------------------
// API ヘルパー関数 (これはグローバルに定義可能)
// -------------------------------------------------------------------------
/**
 * 認証ヘッダーを生成するヘルパー関数
 */
const getAuthHeaders = (token: string | null): Record<string, string> => {
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

// -------------------------------------------------------------------------

export const useItemStore = defineStore("item", () => {
  // ★ 修正点: useRuntimeConfig() を defineStore コールバック内に移動
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.apiBaseUrl;

  // 状態 (State)
  const items = ref<Item[]>([]);
  const item = ref<Item | null>(null);
  const comments = ref<Comment[]>([]);
  const isFavorited = ref(false);
  const favoritesCount = ref(0);
  const currentUserId = ref<number | null>(null);
  const isLoggedIn = ref(false);
  const isLoading = ref(false);
  const errors = ref<string[]>([]);

  // ゲッター (Getters)
  const isSeller = computed(() =>
    item.value ? item.value.user_id === currentUserId.value : false
  );
  const isSold = computed(() => (item.value ? item.value.remain < 1 : true));

  const displayPrice = computed(() => {
    if (!item.value) return "---";
    if (item.value.remain === 0) {
      return "SOLD";
    }
    return item.value.price.toLocaleString();
  });

  const parsedCategories = computed<string[]>(() => {
    if (!item.value || !item.value.category) return [];
    try {
      if (Array.isArray(item.value.category)) return item.value.category;
      const categories = JSON.parse(item.value.category as string);
      return Array.isArray(categories) ? categories : [];
    } catch (e) {
      console.warn("カテゴリのパースに失敗しました:", e);
      return [];
    }
  });

  // ★★★ 追加アクション: 状態をリセットするための手動アクション ★★★
  function clearData() {
    items.value = [];
    item.value = null;
    comments.value = [];
    isFavorited.value = false;
    favoritesCount.value = 0;
    currentUserId.value = null;
    isLoggedIn.value = false;
    isLoading.value = false;
    errors.value = [];
    console.log("[ItemStore] State manually cleared for logout.");
  }

  // アクション (Actions: API通信)

  /**
   * 商品詳細データ、コメント、お気に入り状態をAPIから取得する (トークン対応)
   * @param itemId 商品ID
   * @param token 認証トークン (オプション)
   */
  async function fetchItemDetail(itemId: number, token: string | null) {
    if (typeof itemId !== "number" || isNaN(itemId) || itemId <= 0) {
      errors.value = ["商品IDが無効です。ID取得を確認してください。"];
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    errors.value = [];
    item.value = null;

    try {
      const headers = getAuthHeaders(token);

      const data = await $fetch(`${API_BASE_URL}/items/${itemId}`, {
        method: "GET",
        headers: headers,
      });

      const responseData = data as any;

      item.value = responseData.item as Item;
      comments.value = responseData.comments as Comment[];
      isFavorited.value = responseData.isFavorited as boolean;
      favoritesCount.value = responseData.favoritesCount as number;
      currentUserId.value = responseData.userId as number | null;
      isLoggedIn.value = responseData.isLoggedIn as boolean;

      if (!item.value) {
        throw new Error("商品詳細データが空です。");
      }
    } catch (e: any) {
      console.error("商品詳細の取得に失敗:", e);
      let errorMessage = "データの取得中に予期せぬエラーが発生しました。";

      if (e.response && e.response.status === 404) {
        errorMessage = "商品が見つかりませんでした。";
      } else if (e.response && e.response.status === 401) {
        errorMessage = "認証が必要です。ログイン状態を確認してください。";
      } else if (e.message) {
        errorMessage = e.message;
      }

      errors.value = [errorMessage];
      item.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * お気に入り状態をトグルする (トークン対応)
   * @param token 認証トークン (必須)
   */
  async function toggleFavorite(token: string | null) {
    if (!token) {
      errors.value = ["お気に入りに登録/解除するにはログインが必要です。"];
      return;
    }
    if (!item.value) return;

    errors.value = [];
    const currentStatus = isFavorited.value;

    // 楽観的更新
    isFavorited.value = !currentStatus;
    favoritesCount.value += isFavorited.value ? 1 : -1;

    try {
      const endpoint = currentStatus ? "unfavorite" : "favorite";
      const headers = getAuthHeaders(token);

      await $fetch(`${API_BASE_URL}/items/${item.value.id}/${endpoint}`, {
        method: "POST",
        headers: headers,
      });
    } catch (e: any) {
      console.error("お気に入り操作に失敗:", e);
      errors.value = [
        "お気に入り操作に失敗しました。認証状態またはネットワークを確認してください。",
      ];
      // 悲観的ロールバック
      isFavorited.value = currentStatus;
      favoritesCount.value -= isFavorited.value ? 1 : -1;
    }
  }

  /**
   * コメントを投稿する (トークン対応)
   * @param commentText 投稿するコメント
   * @param token 認証トークン (必須)
   */
  async function postComment(commentText: string, token: string | null) {
    if (!token) {
      errors.value = ["コメントを投稿するにはログインが必要です。"];
      return;
    }
    if (!item.value) return;

    errors.value = [];

    try {
      const headers = getAuthHeaders(token);

      const data = await $fetch(`${API_BASE_URL}/comments`, {
        method: "POST",
        headers: headers,
        body: {
          item_id: item.value.id,
          comment: commentText,
        },
      });

      // 成功した場合、返された新しいコメントデータをコメントリストに追加
      const newCommentData = data as Comment;
      if (newCommentData && newCommentData.id) {
        comments.value.unshift(newCommentData);
      } else {
        throw new Error(
          "コメントの投稿は成功しましたが、サーバーからの応答が不正です。"
        );
      }
    } catch (e: any) {
      console.error("コメント投稿に失敗:", e);
      let errorMessage = "コメントの投稿に失敗しました。";
      if (e.response && e.response.status === 401) {
        errorMessage = "コメント投稿には認証が必要です。";
      } else if (e.response && e.response._data && e.response._data.message) {
        errorMessage = e.response._data.message;
      }
      errors.value = [errorMessage];
    }
  }

  return {
    item,
    items,
    comments,
    isFavorited,
    favoritesCount,
    isLoggedIn,
    isLoading,
    errors,
    currentUserId,
    isSeller,
    isSold,
    displayPrice,
    parsedCategories,
    fetchItemDetail,
    toggleFavorite,
    postComment,
    clearData, // ★★★ 外部からリセット可能にするためにエクスポート
  };
});
