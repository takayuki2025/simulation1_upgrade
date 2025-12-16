import useSWR from "swr";
import axios from "axios";
import { useAuth } from "@/ui/auth/useAuth";

export const useItemDetailSWR = (itemId: number | null) => {
  const { apiClient, isLoading: authLoading } = useAuth();

  const shouldFetch = typeof itemId === "number" && !authLoading;

  const fetcher = async (url: string) => {
    // 🔐 ログイン済み → apiClient（Bearer 付き）
    if (apiClient) {
      const res = await apiClient.get(url.replace("/api", ""));
      return res.data;
    }

    // 👤 未ログイン → 通常 axios
    const res = await axios.get(url);
    return res.data;
  };

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/item/${itemId}` : null,
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
