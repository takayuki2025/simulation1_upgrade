import useSWR from "swr";
import axios from "axios";
import { useAuth } from "@/ui/auth/useAuth";

/**
 * API Response 型
 */
export interface ItemDetailResponse {
  item: {
    id: number;
    name: string;
    price: number;
    explain: string | null;
    remain: number;
    user_id: number;
    shop_id: number;

    brands: string[];
    brand_primary: string | null;
    condition: string | null;
    color: string | null;

    tags: any[];
    item_image: string | null;
  };
  comments: any[];
  is_favorited: boolean;
  favorites_count: number;
}

/**
 * Item Detail SWR
 * - key は itemId のみ（auth / guest を分けない）
 * - 楽観更新・再検証と完全一致
 */
export const useItemDetailSWR = (itemId: number | null) => {
  const { apiClient, isAuthenticated, isReady } = useAuth();

  /**
   * fetch 条件
   */
  const shouldFetch =
    typeof itemId === "number" && Number.isFinite(itemId) && isReady;

  /**
   * ✅ SWR Key（これが最重要）
   * auth / guest を分けない
   */
  const swrKey = shouldFetch ? ["item-detail", itemId] : null;

  /**
   * fetcher
   */
  const fetcher = async (): Promise<ItemDetailResponse> => {
    if (!itemId) {
      throw new Error("itemId is not available");
    }

    // 認証済み（JWT / Cookie）
    if (apiClient) {
      const res = await apiClient.get<ItemDetailResponse>(`/items/${itemId}`);
      return res.data;
    }

    // 未ログイン（guest）
    const res = await axios.get<ItemDetailResponse>(`/api/items/${itemId}`);
    return res.data;
  };

  /**
   * SWR 本体
   */
  const { data, error, isLoading, mutate } = useSWR<ItemDetailResponse>(
    swrKey,
    fetcher,
    {
      // ❌ 勝手に戻る原因になる挙動は全て OFF
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    },
  );

  /**
   * View 用に正規化して返す
   */
  return {
    // core
    item: data?.item ?? null,
    comments: data?.comments ?? [],

    // ❤️ reaction
    isFavorited: data?.is_favorited ?? false,
    favoritesCount: data?.favorites_count ?? 0,

    // state
    isLoading,
    isError: error,

    /**
     * ✅ 外部から使える mutate
     * submitFavorite / rollback / 再検証 用
     */
    mutateItemDetail: mutate,
  };
};
