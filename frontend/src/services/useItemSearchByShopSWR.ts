import useSWR from "swr";
import { useAuth } from "@/ui/auth/useAuth";

export function useItemSearchByShopSWR(shopCode: string, query: string) {
  const { apiClient } = useAuth();

  const shouldFetch = !!apiClient && !!shopCode && query.trim().length > 0;

  const key = shouldFetch ? ["item-search-by-shop", shopCode, query] : null;

  const fetcher = async () => {
    const res = await apiClient!.get("/items/search", {
      params: {
        shop_code: shopCode,
        q: query,
      },
    });
    return res.data;
  };

  const { data, error, isLoading } = useSWR(key, fetcher);

  return {
    items: data?.items ?? data ?? [],
    error,
    isLoading,
  };
}
