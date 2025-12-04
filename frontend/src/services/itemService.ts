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
  const query = new URLSearchParams();
  if (tab === "all" && search) query.append("search", search);
  if (tab === "mylist") query.append("mylist", "true");

  const qs = query.toString();
  const url = `/api/item${qs ? `?${qs}` : ""}`;

  console.log("[useItemsSWR] URL =", url, "apiClient=", !!apiClient);

  // -----------------------------------------------------
  // ★ swrKey を auth/public の2種類に分ける
  // -----------------------------------------------------
  const swrKey = apiClient ? [url, "auth"] : [url, "public"];
  console.log("[useItemsSWR] swrKey =", swrKey);

  // -----------------------------------------------------
  // fetcher
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
