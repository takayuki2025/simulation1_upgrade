import useSWR from "swr";
import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Item } from "@/src/types/item";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!; // "/api"

export function useItemsSWR(
  tab: "all" | "mylist",
  search: string,
  apiClient: AxiosInstance | null,
) {
  // -----------------------------------------------------
  // 1. URL の決定（🔥 /api を付けない version）
  // -----------------------------------------------------
  let url = "/item";

  if (tab === "mylist") {
    url = "/items/favorite";
  } else {
    const query = new URLSearchParams();
    if (search) query.append("search", search);

    const qs = query.toString();
    url = `/item${qs ? `?${qs}` : ""}`;
  }

  console.log("[useItemsSWR] URL =", url);

  // -----------------------------------------------------
  // 2. SWR key
  // -----------------------------------------------------
  const keyTag = apiClient ? "auth" : "public";
  const swrKey = [url, keyTag];

  // -----------------------------------------------------
  // 3. Fetcher
  // -----------------------------------------------------
  const swrFetcher = async () => {
    if (apiClient) {
      const res = await apiClient.get(url);
      return res.data;
    }

    const res = await axios.get(`${API_BASE_URL}${url}`);
    return res.data;
  };

  const swr = useSWR(swrKey, swrFetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
  });

  return {
    items: (swr.data?.items ?? []) as Item[],
    isLoading: swr.isLoading,
    isError: swr.error,
    mutate: swr.mutate,
  };
}
