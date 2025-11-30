const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// プレースホルダー画像URL
export const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/300x300/e0e0e0/333?text=No+Image";

// プロフィール画像がない場合のデフォルトパス
const DEFAULT_PROFILE_IMAGE_PATH = "storage/images/default-profile2.jpg";

// Next.jsの環境変数からASSET_BASE_URLを取得 (API_BASE_URLと同じと仮定)
const ASSET_BASE_URL = API_BASE_URL;

// 💡 【追加】画像タイプを定義する定数
export const IMAGE_TYPE = {
  // 0: 商品画像 (デフォルトのプレースホルダーを使用)
  ITEM: 0,
  // 1: ユーザー画像 (デフォルトのプロフィール画像を使用)
  USER: 1,
  // 必要に応じて他のタイプ (例: BRAND: 2) を追加可能
};

/**
 * 💡【汎用化】アセットパスから完全なURLを生成する関数
 *
 * @param path データベースに保存されている画像パス（Laravelのアクセサにより絶対URLの場合あり）
 * @param imageType 画像の種類を識別するコード (IMAGE_TYPEを参照)
 * @param cacheKey キャッシュバスター用のキー (オプション)
 * @returns 完全な画像URL
 */
export const getImageUrl = (
  path: string | null,
  imageType: number, // 💡 第二引数を画像タイプ識別用に変更
  cacheKey: number = 0, // 💡 キャッシュキーを第三引数に変更
): string => {
  // 1. パスがない場合の処理
  if (!path) {
    if (imageType === IMAGE_TYPE.USER) {
      // ユーザー画像の場合は専用のデフォルト画像を返す
      return `${API_BASE_URL?.replace(/\/$/, "")}/${DEFAULT_PROFILE_IMAGE_PATH}`;
    }
    // 商品画像の場合は汎用のプレースホルダーを返す
    return PLACEHOLDER_IMAGE_URL;
  }

  // 2. 既にフルURL (Laravelのアクセサで変換済み) の場合はそのまま返す
  if (path.startsWith("http")) {
    console.log(
      "DEBUG_IMG: Path starts with http (Absolute URL), returning:",
      path,
    );
    // キャッシュバスターを付与
    const cacheBuster = cacheKey > 0 ? `?t=${cacheKey}` : "";
    return `${path}${cacheBuster}`;
  }

  // 3. フルURLでない場合 (フォールバック)
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

  // 💡 パスが 'storage/' で始まっていない場合は補完 (Laravelのシンボリックリンク構造対応)
  // 例外: API側で既に 'storage/...' が含まれたパスが渡ってくる場合があるため、補完は最小限にする
  if (!cleanPath.startsWith("storage/") && !cleanPath.startsWith("images/")) {
    cleanPath = `storage/${cleanPath}`;
  }

  const cacheBuster = cacheKey > 0 ? `?t=${cacheKey}` : "";

  // ベースURLとクリーンアップされたパスを結合
  const finalUrl = `${baseUrl}/${cleanPath}${cacheBuster}`;

  console.log(
    `DEBUG_IMG: Base: ${baseUrl}, Final Path: /${cleanPath}, Result: ${finalUrl} (Fallback)`,
  );

  return finalUrl;
};

/**
 * 💡【汎用化】画像読み込みエラー発生時の処理 (名前入りのプレースホルダーに置き換え)
 *
 * @param e 画像要素のSyntheticEvent
 * @param name 商品名/ユーザー名など
 */
export const onImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  name: string,
) => {
  const target = e.target as HTMLImageElement;
  // エラーが何度も発生しないように、イベントハンドラを無効化
  target.onerror = null;

  const placeholderText = name ? name.replace(/\s/g, "+") : "Error";

  // エラーハンドリング時に名前入りのプレースホルダーに切り替える
  // サイズは画像の用途に応じて調整できるように、ここでは汎用の300x300を使用
  target.src = `https://placehold.co/300x300/e0e0e0/333?text=${placeholderText}`;
};
