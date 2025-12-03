import type { AxiosInstance } from "axios";
import type { Item } from "@/src/types/item";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface GetItemsParams {
  tab: "all" | "mylist";
  search?: string;
  apiClient?: AxiosInstance;
}

export const itemService = {
  async getItems({ tab, search, apiClient }: GetItemsParams): Promise<Item[]> {
    const query = encodeURIComponent(search ?? "");

    // --------------------------------------
    // ① すべて
    // --------------------------------------
    if (tab === "all") {
      // 🔥 認証済み → Sanctum の認証を通して自分の商品を除外できる
      if (apiClient) {
        const res = await apiClient.get(`/api/item?search=${query}`);
        return res.data.items ?? [];
      }

      // 🔓 未認証 → 完全公開一覧
      const res = await fetch(`${BASE}/api/item?search=${query}`);
      const json = await res.json();
      return json.items ?? [];
    }

    // --------------------------------------
    // ② マイリスト（認証必要）
    // --------------------------------------
    if (!apiClient) return [];

    const res = await apiClient.get(`/api/mypage/favorites?search=${query}`);
    return res.data.items ?? [];
  },
};
