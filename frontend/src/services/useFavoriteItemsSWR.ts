import useSWR from "swr";
import type { AxiosInstance } from "axios";

import { useAuth } from "@/ui/auth/useAuth";
import type { PublicItem } from "@/types/publicItem";

type FavoriteItemsResponse = {
  items: PublicItem[];
};

export const FAVORITE_ITEMS_SWR_KEY = "/items/favorite";

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

    const res = await apiClient.get<FavoriteItemsResponse>(
      FAVORITE_ITEMS_SWR_KEY,
    );

    return res.data;
  };

  const swrKey =
    !isLoading && isAuthenticated && apiClient
      ? FAVORITE_ITEMS_SWR_KEY
      : null;

  const {
    data,
    error,
    isLoading: swrLoading,
    mutate,
  } = useSWR<FavoriteItemsResponse>(swrKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  return {
    items: data?.items ?? [],
    isLoading: isLoading || swrLoading,
    error,

    // ✅ 追加（これだけ）
    mutateFavorites: mutate,
  };
};