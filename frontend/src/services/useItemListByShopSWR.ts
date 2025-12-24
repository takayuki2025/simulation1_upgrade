import useSWR from "swr";
import { useAuth } from "@/ui/auth/useAuth";

export function useItemListByShopSWR(shopCode: string) {
  const { apiClient } = useAuth();

  const { data, error, isLoading } = useSWR(
    shopCode ? `/shops/${shopCode}/items` : null,
    (url) => apiClient.get(url).then((res) => res.data),
  );

  return {
    items: data?.items ?? [],
    shop: data?.shop ?? null,
    isLoading,
    error,
  };
}
