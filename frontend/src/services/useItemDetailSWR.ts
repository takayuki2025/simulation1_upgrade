import useSWR from "swr";
import axios from "axios";
import { useAuth } from "@/ui/auth/useAuth";

export const useItemDetailSWR = (itemId: number | null) => {
  const { apiClient, isLoading: authLoading } = useAuth();

  const shouldFetch = typeof itemId === "number" && !authLoading;

  const fetcher = async (url: string) => {
    if (apiClient) {
      const res = await apiClient.get(url); // ← 素のパス
      return res.data;
    }
    const res = await axios.get(`/api${url}`); // 未ログイン時だけ /api
    return res.data;
  };

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/item/${itemId}` : null, // ← /api を消す
    fetcher,
  );

  return {
    item: data?.item ?? null,
    comments: data?.comments ?? [],
    isFavorited: data?.isFavorited ?? false,
    favoritesCount: data?.favoritesCount ?? 0,
    isLoading: isLoading || authLoading,
    isError: error,
    mutate,
  };
};
