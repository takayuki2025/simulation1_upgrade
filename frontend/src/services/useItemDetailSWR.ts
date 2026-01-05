import { useEffect } from "react";
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

export const useItemDetailSWR = (itemId: number | null) => {
  const { apiClient, isAuthenticated, isReady } = useAuth();

  const shouldFetch =
    typeof itemId === "number" && Number.isFinite(itemId) && isReady;

  /**
   * ✅ auth / guest を SWR Key に含める
   * → 認証状態が変わったら必ず再取得
   */
  const swrKey = shouldFetch
    ? ["item-detail", itemId, apiClient ? "auth" : "guest"]
    : null;

  const fetcher = async (): Promise<ItemDetailResponse> => {
    if (!itemId) {
      throw new Error("itemId is not available");
    }

    if (apiClient) {
      const res = await apiClient.get<ItemDetailResponse>(`/items/${itemId}`);
      return res.data;
    }

    const res = await axios.get<ItemDetailResponse>(`/api/items/${itemId}`);
    return res.data;
  };

  const { data, error, isLoading, mutate } = useSWR<ItemDetailResponse>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );

  /**
   * ✅ 認証が ready になった瞬間に再取得
   * （guest → auth のズレを完全解消）
   */
  useEffect(() => {
    if (isAuthenticated && apiClient && isReady) {
      mutate();
    }
  }, [isAuthenticated, apiClient, isReady, mutate]);

  return {
    item: data?.item ?? null,
    comments: data?.comments ?? [],
    isFavorited: data?.is_favorited ?? false,
    favoritesCount: data?.favorites_count ?? 0,
    isLoading,
    isError: error,
    mutateItemDetail: mutate,
  };
};