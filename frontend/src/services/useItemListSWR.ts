import useSWR from "swr";
import axios from "axios";
import { PublicItem } from "@/types/publicItem";
import { useAuth } from "@/ui/auth/useAuth";

type Response = {
  items: PublicItem[];
};

export const useItemListSWR = () => {
  const { apiClient, isLoading } = useAuth();

  const fetcher = async (): Promise<Response> => {
    if (apiClient) {
      const res = await apiClient.get("/items/public");
      return res.data;
    }
    const res = await axios.get("/api/items/public");
    return res.data;
  };

  const {
    data,
    error,
    isLoading: swrLoading,
  } = useSWR<Response>("public-items", fetcher);

  return {
    items: data?.items ?? [],
    isLoading: isLoading || swrLoading,
    error,
  };
};
