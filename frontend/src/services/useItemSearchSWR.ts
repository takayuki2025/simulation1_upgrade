import useSWR from "swr";
import { Item } from "@/types/item";

type ItemSearchResponse = {
  items: Item[];
};

export const useItemSearchSWR = (query: string) => {
  const { data, error, isLoading } = useSWR<ItemSearchResponse>(
    query ? `/api/items/search?q=${query}` : null,
  );

  return {
    items: data?.items ?? [],
    isLoading,
    error,
  };
};
