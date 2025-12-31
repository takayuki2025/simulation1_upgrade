import useSWR from "swr";
import axios from "axios";
import { PublicItem } from "@/types/publicItem";
import { useAuth } from "@/ui/auth/useAuth";

type Response = { items: PublicItem[] };

export const useItemListSWR = () => {
  const { apiClient, user, isLoading } = useAuth();

  const fetcher = async (): Promise<Response> => {
    // 認証済みは apiClient（Bearer付き）だけを使う
    if (apiClient) {
      const res = await apiClient.get("/items/public");
      return res.data;
    }
    // ゲストは axios でOK
    const res = await axios.get("/api/items/public");
    return res.data;
  };

  /**
   * 🔑 最重要：
   * - isLoading の間は key=null にして SWR を止める
   *   → ゲスト結果が先にキャッシュされる事故を防ぐ
   */
  const swrKey = isLoading
    ? null
    : user
      ? ["public-items", user.id]
      : ["public-items", "guest"];

  const {
    data,
    error,
    isLoading: swrLoading,
  } = useSWR<Response>(swrKey, fetcher);

  return {
    items: data?.items ?? [],
    isLoading: isLoading || swrLoading,
    error,
  };
};
