import useSWR from "swr";
import axios from "axios";
import { useAuth } from "@/ui/auth/useAuth";
import type { PublicItem } from "@/types/publicItem";

type ItemSearchResponse = {
  items: PublicItem[];
};

export const useItemSearchSWR = (query: string) => {
  const { apiClient, isAuthenticated, isLoading: authLoading } = useAuth();

  const shouldFetch = !authLoading && query.trim().length > 0;

  /**
   * ★ 超重要：auth 状態で key を分離
   */
  const key = shouldFetch
    ? ["search-items", query, isAuthenticated ? "auth" : "guest"]
    : null;

  const fetcher = async (): Promise<ItemSearchResponse> => {
    // 🔑 認証あり
    if (apiClient) {
      const res = await apiClient.get(
        `/search/items?keyword=${encodeURIComponent(query)}`,
      );
      return res.data;
    }

    // 👤 ゲスト（同じエンドポイント）
    const res = await axios.get(
      `/api/search/items?keyword=${encodeURIComponent(query)}`,
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
