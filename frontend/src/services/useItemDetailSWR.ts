import useSWR from "swr";
import axios from "axios";
import { useAuth } from "@/ui/auth/useAuth";

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

  const shouldFetch = typeof itemId === "number" && isReady;
  const url = shouldFetch ? `/items/${itemId}` : null;

  /**
   * 🔑 auth / guest を完全分離
   */
  const swrKey = url
    ? ["item-detail", itemId, isAuthenticated ? "auth" : "guest"]
    : null;

  const fetcher = async (): Promise<ItemDetailResponse | null> => {
    if (!url) return null;

    if (apiClient) {
      const res = await apiClient.get(url);
      return res.data;
    }

    const res = await axios.get(`/api${url}`);
    return res.data;
  };

  const { data, error, isLoading } = useSWR<ItemDetailResponse | null>(
    swrKey,
    fetcher,
    {
      // 🚫 これが無いと「勝手に戻る」
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    },
  );

  return {
    item: data?.item ?? null,
    comments: data?.comments ?? [],
    isFavorited: data?.is_favorited ?? false,
    favoritesCount: data?.favorites_count ?? 0,
    isLoading,
    isError: error,
  };
};
