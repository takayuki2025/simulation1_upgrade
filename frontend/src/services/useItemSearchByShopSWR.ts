import useSWR from "swr";
import axios from "axios";
import { useAuth } from "@/ui/auth/useAuth";
import type { PublicItem } from "@/types/publicItem";

type ItemSearchResponse = {
  items: PublicItem[];
};

export const useItemSearchSWR = (query: string) => {
  const { apiClient, isAuthenticated, isLoading: authLoading } = useAuth();

  // 🔴 重要：auth が終わるまで「絶対に」fetch しない
  const shouldFetch =
    !authLoading && isAuthenticated && query.trim().length > 0;

  const key = shouldFetch ? ["search", "items", query, "auth"] : null;

  const fetcher = async (): Promise<ItemSearchResponse> => {
    // 🔑 認証必須
    const res = await apiClient!.get(
      `/search/items?keyword=${encodeURIComponent(query)}`,
    );
    return res.data;
  };

  const { data, error, isLoading } = useSWR<ItemSearchResponse>(key, fetcher);

  return {
    items: data?.items ?? [],
    isLoading: authLoading || isLoading,
    error,
  };
};
