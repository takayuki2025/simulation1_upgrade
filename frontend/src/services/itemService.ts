import useSWR from "swr";
import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Item, ItemComment } from "@/src/types/item";

/* ============================================================
   商品一覧
============================================================ */
export function useItemsSWR(
  tab: "all" | "mylist",
  search: string,
  apiClient: AxiosInstance | null,
) {
  let url = "/item";

  if (tab === "mylist") {
    url = "/items/favorite";
  } else {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    url = `/item${params.toString() ? `?${params.toString()}` : ""}`;
  }

  const keyTag = apiClient ? "auth" : "public";
  const swrKey = [url, keyTag];

  const swrFetcher = async () => {
    if (apiClient) {
      const response = await apiClient.get(url);
      return response.data;
    }
    const response = await axios.get(`/api${url}`);
    return response.data;
  };

  const swr = useSWR(swrKey, swrFetcher);

  return {
    items: (swr.data?.items ?? []) as Item[],
    isLoading: swr.isLoading,
    isError: swr.error,
    mutate: swr.mutate,
  };
}

/* ============================================================
   商品詳細
   — mutate エラーを避けるため Response の型をそのまま維持 —
============================================================ */

export interface ItemDetailResponse {
  item: Item;
  comments: ItemComment[];
  is_favorited: boolean;
  favorites_count: number;
}

export function useItemDetailSWR(
  itemId: number | null,
  apiClient: AxiosInstance | null,
) {
  const url = itemId ? `/item/${itemId}` : null;

  const keyTag = apiClient ? "auth" : "public";
  const swrKey = url ? [url, keyTag] : null;

  const swrFetcher = async (): Promise<ItemDetailResponse | null> => {
    if (!url) return null;

    if (apiClient) {
      const response = await apiClient.get(url);
      return response.data;
    }
    const response = await axios.get(`/api${url}`);
    return response.data;
  };

  const swr = useSWR<ItemDetailResponse | null>(swrKey, swrFetcher);

  return {
    data: swr.data,
    item: swr.data?.item ?? null,
    comments: swr.data?.comments ?? [],
    isFavorited: swr.data?.is_favorited ?? false,
    favoritesCount: swr.data?.favorites_count ?? 0,

    isLoading: swr.isLoading,
    isError: swr.error,
    mutate: swr.mutate,
  };
}

export const useShopItemsSWR = (
  shopId: number | null,
  apiClient: AxiosInstance | null,
) => {
  const url = shopId ? `/shops/${shopId}/items` : null;
  const key = url ? [url, apiClient ? "auth" : "public"] : null;

  const fetcher = async () => {
    if (!url) return null;
    if (apiClient) {
      const res = await apiClient.get(url);
      return res.data;
    }
    const res = await axios.get(`/api${url}`);
    return res.data;
  };

  const swr = useSWR(key, fetcher);

  return {
    items: (swr.data?.items ?? []) as Item[],
    isLoading: swr.isLoading,
    isError: swr.error,
  };
};