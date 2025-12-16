import useSWR from "swr";
import type { AxiosInstance } from "axios";
import { Item } from "@/types/item";
import { useAuth } from "@/ui/auth/useAuth";

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
    const res = await apiClient!.get<FavoriteItemsResponse>("/items/favorite");
    return res.data;
  };

  // 🔑 JWT が確定してから fetch
  const swrKey =
    !isLoading && isAuthenticated && apiClient ? ["favorite-items"] : null;

  const { data, error, isLoading: swrLoading } = useSWR(swrKey, fetcher);

  return {
    items: data?.items ?? [],
    isLoading: swrLoading || isLoading,
    error,
  };
};
