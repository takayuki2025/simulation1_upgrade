// プレースホルダー画像URL
export const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/300x300/e0e0e0/333?text=No+Image";

// Next.jsの環境変数からASSET_BASE_URLを取得 (今回はAPI_BASE_URLと同じとして扱う)
// 実際のNext.js環境では静的アセットはパブリックディレクトリに置くことが多いですが、
// Laravel側のStorageを参照する設定を再現します。
const ASSET_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * APIから返された画像パスを、外部アクセス可能なフルURLに変換する
 */
export const getImageUrl = (
  path: string | null,
  imageRefreshKey: number
): string => {
  if (!path) {
    return PLACEHOLDER_IMAGE_URL;
  }

  if (path.startsWith("http")) {
    return path;
  }

  if (!ASSET_BASE_URL) {
    console.error("ASSET_BASE_URL is not set.");
    return PLACEHOLDER_IMAGE_URL;
  }

  const baseUrl = ASSET_BASE_URL.endsWith("/")
    ? ASSET_BASE_URL.slice(0, -1)
    : ASSET_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path.substring(1) : path;

  // キャッシュバスターとして imageRefreshKey の値を付加
  const cacheBuster = `?t=${imageRefreshKey}`;

  // Laravelのストレージパス (例: https://laravel.test/storage/items/image.jpg) に対応させる
  return `${baseUrl}/storage/${normalizedPath}${cacheBuster}`;
};

/**
 * 画像読み込みエラー発生時の処理 (商品名入りのプレースホルダーに置き換え)
 */
export const onImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  itemName: string
) => {
  const target = e.target as HTMLImageElement;
  target.onerror = null;
  const placeholderText = itemName ? itemName.replace(/\s/g, "+") : "Error";
  // エラーハンドリング時にプレースホルダーに切り替える
  target.src = `https://placehold.co/300x300/e0e0e0/333?text=${placeholderText}`;
};
