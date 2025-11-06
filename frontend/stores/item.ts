import { defineStore } from "pinia";
import { ref } from "vue";

// 商品の型定義 (実際のデータ構造に合わせてください)
interface Item {
  id: number;
  name: string;
  description: string;
  user_id: number;
}

// 商品ストアを定義
export const useItemStore = defineStore("item", {
  state: () => ({
    // ログアウト時にリセットしたい商品リスト
    items: [] as Item[],
    selectedItem: null as Item | null,
    isLoading: false,
  }),
  actions: {
    // ここに他のロジックが入ります
  },
});
