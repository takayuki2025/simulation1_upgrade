// プレースホルダー画像URL
export const PLACEHOLDER_IMAGE_URL =
    "https://placehold.co/300x300/e0e0e0/333?text=No+Image";

// Next.jsの環境変数からASSET_BASE_URLを取得 (今回はAPI_BASE_URLと同じとして扱う)
// 実際のNext.js環境では静的アセットはパブリックディレクトリに置くことが多いですが、
// Laravel側のStorageを参照する設定を再現します。
const ASSET_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getImageUrl = (
  path: string | null,
  imageRefreshKey: number
): string => {
  if (!path) {
    return PLACEHOLDER_IMAGE_URL;
  }

  // 既にフルURLであればそのまま返す (このケースでは二重結合は起きないはず)
  if (path.startsWith("http")) {
    console.log("DEBUG_IMG: Path starts with http, returning:", path);
    return path;
  }

  if (!ASSET_BASE_URL) {
    console.error("ASSET_BASE_URL is not set.");
    return PLACEHOLDER_IMAGE_URL;
  }

  // --- ここから結合処理 ---

  const baseUrl = ASSET_BASE_URL.endsWith("/")
    ? ASSET_BASE_URL.slice(0, -1)
    : ASSET_BASE_URL;

  let cleanPath = path;

  // 💡 修正強化: 二重の結合を招く可能性のある文字列を徹底的に削除
  // データベースの値は「storage/item_images/...」なので、まずこれを削る
  if (cleanPath.startsWith("storage/")) {
    cleanPath = cleanPath.substring("storage/".length);
  }

  // 念のため、URLのプロトコル部分が残っていないかチェックし、削除
  if (cleanPath.includes("https://") || cleanPath.includes("http://")) {
    console.error(
      "DEBUG_IMG: Path still contains protocol! Data is corrupted:",
      cleanPath
    );
    // ここでクリーンアップ処理を行うべきですが、一旦エラーを表示
    // 緊急措置として、フルURL全体をファイルパスとして誤って連結するのを防ぎます

    // 🚨 暫定的な強制クリーンアップ (本来は不要)
    const parts = cleanPath.split("storage/").pop();
    cleanPath = parts || "";
  }

  const normalizedPath = cleanPath.startsWith("/")
    ? cleanPath.substring(1)
    : cleanPath;

  const cacheBuster = `?t=${imageRefreshKey}`;

  // 結合する要素をコンソールに出力して確認
  const finalUrl = `${baseUrl}/storage/${normalizedPath}${cacheBuster}`;
  console.log(
    `DEBUG_IMG: Base: ${baseUrl}, Final Path: /storage/${normalizedPath}, Result: ${finalUrl}`
  );

  return finalUrl;
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
