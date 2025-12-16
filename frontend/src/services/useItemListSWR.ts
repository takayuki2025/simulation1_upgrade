import useSWR from "swr";
import axios from "axios";
import { useAuth } from "@/ui/auth/useAuth";
import { Item } from "@/types/item";

type ItemListResponse = {
  items: Item[];
};

export const useItemListSWR = () => {
  const { user, apiClient, isLoading: authLoading } = useAuth();

  // 🔑 auth が確定するまで fetch しない
  const url = !authLoading ? (user ? "/items/public" : "/items") : null;

  const fetcher = async () => {
    if (!url) return null;

    if (user && apiClient) {
      const res = await apiClient.get(url);
      return res.data;
    }

    const res = await axios.get(`/api${url}`);
    return res.data;
  };

  // 🔑 SWR key に user.id を含める
  const swrKey = url
    ? user
      ? ["items", "public", user.id]
      : ["items", "public", "guest"]
    : null;

  const { data, error, isLoading } = useSWR<ItemListResponse>(swrKey, fetcher);

  return {
    items: data?.items ?? [],
    isLoading: isLoading || authLoading,
    error,
  };
};
