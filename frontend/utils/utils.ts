// ======================================
// 画像タイプ Enum
// ======================================
export enum IMAGE_TYPE {
  USER = "user",
  ITEM = "item",
  OTHER = "other",
}

// ======================================
//  API ベースURL（使わないが一応保持）
// ======================================
export const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://laravel.test";

// ======================================
//  getImageUrl(path, type, cacheBuster)
// ======================================
export const getImageUrl = (
  path: string | null,
  type: IMAGE_TYPE = IMAGE_TYPE.OTHER,
  cacheBuster?: number,
): string => {
  if (!path) return "https://placehold.co/300x300?text=No+Image";

  // 外部 URL ならそのまま返す
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return cacheBuster ? `${path}?v=${cacheBuster}` : path;
  }

  // 種類別の prefix
  let prefix = "";
  switch (type) {
    case IMAGE_TYPE.USER:
      prefix = "/storage/user_images";
      break;
    case IMAGE_TYPE.ITEM:
      prefix = "/storage/item_images";
      break;
    default:
      prefix = "/storage/other";
  }

  const url = `${prefix}/${path}`;
  return cacheBuster ? `${url}?v=${cacheBuster}` : url;
};

// ======================================
// 画像エラー時の差し替え
// ======================================
export const onImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  name: string,
) => {
  const img = e.target as HTMLImageElement;
  img.onerror = null;
  img.src = `https://placehold.co/300x300?text=${name}`;
};
