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
const STORAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "https://localhost/storage";



// export const BASE =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "https://laravel.test";

// ======================================
//  getImageUrl(path, type, cacheBuster)
// ======================================
/**
 * getImageUrl
 *
 * Backend から返る画像パス（相対 or 完全URL）を
 * 「ブラウザでそのまま使えるURL」に正規化する。
 *
 * - Domain / API は「生パス」しか知らない
 * - CDN / S3 切り替えはここだけを変更する
 */
export function getImageUrl(path?: string | null): string {
  if (!path) {
    return "/images/no-image.png";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${STORAGE_BASE_URL}/${path}`;
}






// export const getImageUrl = (
//   path: string | null,
//   _type?: IMAGE_TYPE,
//   cacheBuster?: number,
// ): string => {
//   if (!path) return "https://placehold.co/300x300?text=No+Image";

//   // Laravel が返した public URL / public path はそのまま使う
//   if (
//     path.startsWith("/") ||
//     path.startsWith("http://") ||
//     path.startsWith("https://")
//   ) {
//     return cacheBuster ? `${path}?v=${cacheBuster}` : path;
//   }

//   // 想定外（保険）
//   return cacheBuster ? `/${path}?v=${cacheBuster}` : `/${path}`;
// };

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
