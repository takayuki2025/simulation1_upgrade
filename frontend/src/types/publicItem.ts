export type PublicItem = {
  id: number;
  name: string;
  price: number;
  itemImagePath: string | null;
  brandPrimary: string | null;
  conditionName: string | null;
  colorName: string | null;
  publishedAt: string | null;
  displayType: "STAR" | "COMET" | null;
};
