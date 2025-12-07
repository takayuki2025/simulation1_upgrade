import useSWR from "swr";
import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Item } from "@/src/types/item";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function useItemsSWR(
  tab: "all" | "mylist",
  search: string,
  apiClient: AxiosInstance | null,
) {
  // -----------------------------------------------------
  // 🔥 1. URL の決定（ここが今回の修正点）
  // -----------------------------------------------------
  let url = "/api/item";

  if (tab === "mylist") {
    url = "/api/items/favorite"; // ⭐ いいね一覧 API に切り替え
  } else {
    // all の検索
    const query = new URLSearchParams();
    if (search) query.append("search", search);

    const qs = query.toString();
    url = `/api/item${qs ? `?${qs}` : ""}`;
  }

  console.log(
    "[useItemsSWR] URL =",
    url,
    "tab=",
    tab,
    "apiClient=",
    !!apiClient,
  );

  // -----------------------------------------------------
  // 2. SWR key を mode（public/auth）で分ける
  // -----------------------------------------------------
  const keyTag = apiClient ? "auth" : "public";
  const swrKey = [url, keyTag];

  console.log("[useItemsSWR] swrKey =", swrKey);

  // -----------------------------------------------------
  // 3. fetcher
  // -----------------------------------------------------
  const swrFetcher = async () => {
    if (apiClient) {
      const res = await apiClient.get(url);
      return res.data;
    }
    const res = await axios.get(`${API_BASE_URL}${url}`);
    return res.data;
  };

  const swrConfig = {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    refreshInterval: 0,
  };

  const swr = useSWR(swrKey, swrFetcher, swrConfig);

  return {
    items: (swr.data?.items ?? []) as Item[],
    isLoading: swr.isLoading,
    isError: swr.error,
    mutate: swr.mutate,
  };
}
