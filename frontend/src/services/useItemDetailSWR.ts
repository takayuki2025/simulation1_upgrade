import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useItemDetailSWR = (itemId: number | null) => {
  const shouldFetch = typeof itemId === "number";

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/item/${itemId}` : null,
    fetcher,
  );

  return {
    item: data?.item ?? null,
    comments: data?.comments ?? [],
    isFavorited: data?.is_favorited ?? false,
    favoritesCount: data?.favorites_count ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
};
