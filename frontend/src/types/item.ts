export interface Item {
  id: number;
  name: string;
  price: number;
  item_image: string | null;
  remain: number;
  is_favorited?: boolean;
}
