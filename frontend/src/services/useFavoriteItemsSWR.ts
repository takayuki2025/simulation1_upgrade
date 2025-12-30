import useSWR from "swr";
import type { AxiosInstance } from "axios";
import { Item } from "@/types/item";
import { useAuth } from "@/ui/auth/useAuth";

/**
 * 🔒 Favorite Items（Domain 専用）
 * - ログイン必須
 * - マイページ / マイリスト用
 * - Public では絶対に使わない
 */
type FavoriteItemsResponse = {
  items: Item[];
};

export const useFavoriteItemsSWR = () => {
  const { apiClient, isAuthenticated, isLoading } = useAuth() as {
    apiClient: AxiosInstance | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  };

  const fetcher = async (): Promise<FavoriteItemsResponse> => {
    if (!apiClient) {
      throw new Error("apiClient is not available");
    }

    const res = await apiClient.get<FavoriteItemsResponse>("/items/favorite");
    return res.data;
  };

  // 🔑 JWT が確定してからのみ fetch
  const swrKey =
    !isLoading && isAuthenticated && apiClient ? ["favorite-items"] : null;

  const {
    data,
    error,
    isLoading: swrLoading,
  } = useSWR<FavoriteItemsResponse>(swrKey, fetcher);

  return {
    items: data?.items ?? [],
    isLoading: swrLoading || isLoading,
    error,
  };
};
