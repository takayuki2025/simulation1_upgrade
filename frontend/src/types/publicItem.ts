export type PublicItem = {
  id: number;
  name: string;
  price: number;
  brandPrimary: string | null;
  conditionName: string | null;
  colorName: string | null;
  itemImagePath: string | null;
  publishedAt: string; // ISO string
  isOwnPersonalItem?: boolean;
};
