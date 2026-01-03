import useSWR from "swr";
import type { PublicItem } from "@/types/publicItem";
import { useAuth } from "@/ui/auth/useAuth";

type ItemSearchResponse = {
  items: PublicItem[];
};

export const useItemSearchByShopSWR  = (shopCode?: string) => {
  const { apiClient, isReady } = useAuth();

  const shouldFetch =
    typeof shopCode === "string" &&
    shopCode.length > 0;

  console.log("[SWR] shouldFetch", {
    isReady,
    hasApiClient: !!apiClient,
    shopCode,
  });

  const key = shouldFetch ? ["shop-items", shopCode] : null;

  const fetcher = async () => {
    console.log("[SWR] fetching shop items", shopCode);
    const res = await apiClient!.get(`/shops/${shopCode}/items`);
    console.log("[SWR] response", res.data);
    return res.data;
  };

  const { data, isLoading } = useSWR(key, fetcher);

  return {
    items: data?.items ?? [],
    isLoading,
  };
};