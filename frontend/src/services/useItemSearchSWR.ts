import useSWR from "swr";
import axios from "axios";
import { Item } from "@/types/item";

type ItemSearchResponse = {
  items: Item[];
};

export const useItemSearchSWR = (query: string) => {
  const key = query ? ["search", "items", query] : null;

  const fetcher = async () => {
    const res = await axios.get(
      `/api/search/items?q=${encodeURIComponent(query)}`,
    );
    return res.data;
  };

  console.log("[useItemSearchSWR] fired:", query);

  const { data, error, isLoading } = useSWR<ItemSearchResponse>(key, fetcher);

  return {
    items: data?.items ?? [],
    isLoading,
    error,
  };
};
