import useSWR from "swr";
import { Item } from "@/types/item";

type ItemListResponse = {
  items: Item[];
};

export const useItemListSWR = () => {
  const { data, error, isLoading } = useSWR<ItemListResponse>("/api/items");

  return {
    items: data?.items ?? [],
    isLoading,
    error,
  };
};
