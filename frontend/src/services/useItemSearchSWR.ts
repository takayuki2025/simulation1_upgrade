import useSWR from "swr";
import axios from "axios";
import { PublicItem } from "@/types/publicItem";

type ItemSearchResponse = {
  items: PublicItem[];
};

export const useItemSearchSWR = (query: string) => {
  const key = query ? ["search", "items", query] : null;

  const fetcher = async () => {
    const res = await axios.get(
      `/api/search/items?q=${encodeURIComponent(query)}`,
    );
    return res.data;
  };

  const { data, error, isLoading } = useSWR<ItemSearchResponse>(key, fetcher);

  return {
    items: data?.items ?? [],
    isLoading,
    error,
  };
};
