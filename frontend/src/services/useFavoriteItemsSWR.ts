import useSWR from "swr";
import type { AxiosInstance } from "axios";
import { Item } from "@/types/item";
import { useAuth } from "@/ui/auth/useAuth";

type FavoriteItemsResponse = {
  items: Item[];
};

export const useFavoriteItemsSWR = () => {
  const { apiClient, user, isAuthenticated, isLoading } = useAuth() as {
    apiClient: AxiosInstance | null;
    user: { id: number } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  };

  const fetcher = async (): Promise<FavoriteItemsResponse> => {
    if (!apiClient) {
      throw new Error("apiClient is not available");
    }

    // ✅ backend と一致
    const res = await apiClient.get<FavoriteItemsResponse>("/items/favorite");
    return res.data;
  };

  const swrKey =
    !isLoading && isAuthenticated && apiClient && user
      ? ["favorite-items", user.id]
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
    isLoading: swrLoading || isLoading,
    error,
    mutate,
  };
};
