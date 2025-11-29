const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// プレースホルダー画像URL
export const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/300x300/e0e0e0/333?text=No+Image";

// Next.jsの環境変数からASSET_BASE_URLを取得 (API_BASE_URLと同じと仮定)
const ASSET_BASE_URL = API_BASE_URL;

/**
 * 商品画像パスから完全なURLを生成する関数
 *
 * @param path データベースに保存されている画像パス（Laravelのアクセサにより絶対URLの場合あり）
 * @param imageRefreshKey キャッシュバスター用のキー
 * @returns 完全な画像URL
 */
export const getImageUrl = (
  path: string | null,
  imageRefreshKey: number,
): string => {
  if (!path) {
    return PLACEHOLDER_IMAGE_URL;
  }

  // 1. 既にフルURL (Laravelのアクセサで変換済み) の場合はそのまま返す
  if (path.startsWith("http")) {
    console.log(
      "DEBUG_IMG: Path starts with http (Absolute URL), returning:",
      path,
    );
    // キャッシュバスターが必要な場合はここで付与
    const cacheBuster = `?t=${imageRefreshKey}`;
    // 既にクエリパラメータがある場合は & を使うなど考慮が必要ですが、ここではシンプルに付与
    // Laravelのアクセサが生成するURLにクエリが含まれる可能性は低いため、このままとします。
    return `${path}${cacheBuster}`;
  }

  // 2. フルURLでない場合 (Laravelのアクセサが機能していない/フォールバックの場合)
  if (!ASSET_BASE_URL) {
    console.error("ASSET_BASE_URL is not set.");
    return PLACEHOLDER_IMAGE_URL;
  }

  // --- フォールバックの結合処理 ---

  // ASSET_BASE_URLから末尾のスラッシュを削除
  const baseUrl = ASSET_BASE_URL.endsWith("/")
    ? ASSET_BASE_URL.slice(0, -1)
    : ASSET_BASE_URL;

  let cleanPath = path;

  // パスの先頭にあるスラッシュやバックスラッシュを削除
  cleanPath = cleanPath.replace(/^[/\\]+/, "");

  const cacheBuster = `?t=${imageRefreshKey}`;

  // ベースURLとクリーンアップされたパスを結合
  // データベースの値が 'storage/item_images/xxx.jpg' のような相対パスの場合に使用されます。
  const finalUrl = `${baseUrl}/${cleanPath}${cacheBuster}`;

  console.log(
    `DEBUG_IMG: Base: ${baseUrl}, Final Path: /${cleanPath}, Result: ${finalUrl} (Fallback)`,
  );

  return finalUrl;
};

/**
 * 画像読み込みエラー発生時の処理 (商品名入りのプレースホルダーに置き換え)
 *
 * @param e 画像要素のSyntheticEvent
 * @param itemName 商品名
 */
export const onImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  itemName: string,
) => {
  const target = e.target as HTMLImageElement;
  // エラーが何度も発生しないように、イベントハンドラを無効化
  target.onerror = null;

  const placeholderText = itemName ? itemName.replace(/\s/g, "+") : "Error";

  // エラーハンドリング時に商品名入りのプレースホルダーに切り替える
  target.src = `https://placehold.co/300x300/e0e0e0/333?text=${placeholderText}`;
};
