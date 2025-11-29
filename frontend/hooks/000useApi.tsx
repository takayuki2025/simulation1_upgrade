"use client";

import { useCallback } from "react";
// axios の型を正しくインポート
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useAuth } from "./useSanctumAuth"; // useAuthフックのパスを調整してください

// Next.jsの環境変数を使用
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// =======================================================
// 型定義
// =======================================================

/**
 * 💡 修正点 1: AxiosRequestConfigを拡張し、カスタムプロパティ'body'を許容
 * Axiosの 'data' プロパティは POST/PUT/PATCH リクエストのボディを表しますが、
 * 明示的に 'body' として渡したい場合に対応するため拡張します。
 */
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  body?: any; // リクエストボディとして許容
}

interface ProfileForm {
  name: string;
  post_number: string;
  address: string;
  building: string;
}

interface UpdatedUserResponse {
  id: number;
  name: string;
  email: string;
  uid: string;
  email_verified_at: string | null;
  post_number: string | null;
  address: string | null;
  building: string | null;
  user_image?: string | null;
}

// =======================================================
// カスタムAPIフック
// =======================================================

export function useApi() {
  // useAuth からユーザー情報、ログアウト関数、ログアウト状態を取得
  const { user, logout, isLoggingOut } = useAuth();

  /**
   * 認証済みのAPIリクエストを実行する汎用関数 (Firebase ID Tokenを自動付与)
   * @param url リクエストURL（/api/ から始まる相対パスを推奨）
   * @param config Axiosリクエスト設定
   * @returns APIレスポンスデータ
   */
  const authenticatedFetch = useCallback(
    async (
      url: string,
      config: CustomAxiosRequestConfig = {},
    ): Promise<any> => {
      if (isLoggingOut) {
        throw new Error("Logging out, cannot perform API request.");
      }

      // ユーザーオブジェクトが存在しない場合は、認証セッションがないためログアウト処理へ
      if (!user) {
        console.error("[useApi] User object missing. Forcing logout.");
        // await logout(); // Home.tsx側で認証状態を見てスキップするため、ここではログアウトを強制しない場合もある
        throw new Error("User not authenticated.");
      }

      // --- 最新のFirebase ID Tokenを強制的に取得 (トークン失効対策) ---
      let idToken: string;
      try {
        // getIdToken(true): キャッシュを無視して、Firebaseから強制的に最新のトークンを取得
        idToken = await user.getIdToken(true);
      } catch (e) {
        console.error(
          "[useApi] Failed to refresh/get ID Token. Forcing logout.",
          e,
        );
        await logout(); // トークン取得失敗は致命的エラーのためログアウト
        throw new Error("Failed to retrieve fresh authentication token.");
      }
      // ----------------------------------------

      // --- APIパスの整形 ---
      // /api/ プレフィックスを保証し、重複するスラッシュを削除
      let apiPath = url.startsWith("/api/") ? url : `/api${url}`;
      apiPath = apiPath.replace(/\/\/+/g, "/");
      // ----------------------------------------

      // --- ヘッダーの構築 ---
      const baseHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      // 1. デフォルトヘッダーと、configから渡されたヘッダーをマージ
      const mergedHeaders = {
        ...baseHeaders,
        ...config.headers, // 外部から渡されたヘッダーが優先される
      };

      // 2. 最後に、認証トークンを確実に設定 (上書きされないように最後に配置)
      const finalHeaders = {
        ...mergedHeaders,
        Authorization: `Bearer ${idToken}`, // 認可ヘッダー
        "X-Firebase-Token": idToken, // カスタムヘッダー (バックエンドの実装に依存)
      };

      // 💡 修正点 2: FormDataを使用する場合の 'Content-Type' 削除ロジック
      // Content-Type: undefined のエントリを削除し、Axios/ブラウザに自動で multipart/form-data の設定をさせる
      if (finalHeaders["Content-Type"] === undefined) {
        // TypeScriptエラー回避のため 'as any' で一時的に型チェックを無効にする
        delete (finalHeaders as any)["Content-Type"];
      }

      const headers = finalHeaders;

      // --- Axiosリクエストの実行 ---
      try {
        const response = await axios({
          method: config.method || "GET",
          url: `${API_BASE_URL}${apiPath}`,
          // config.data または config.body のいずれかをリクエストボディとして使用
          data: config.data || config.body,
          params: config.params,
          headers: headers,
          withCredentials: true, // クッキー/セッション情報送信を許可
        });

        return response.data;
      } catch (error: any) {
        // --- エラーハンドリング ---
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;

          if (status === 401) {
            console.error(
              "[useApi] 401 Unauthorized detected. Token likely expired on backend.",
            );
            // ログアウトせず、エラーをスローして呼び出し元でリカバリ（必要に応じてリロードやリトライ）させる
            const customError = new Error(`API Request Failed with status 401`);
            (customError as any).status = 401;
            (customError as any).response = error.response;
            throw customError;
          }

          // 401以外のエラーもカスタムエラーとしてスロー
          const customError = new Error(
            `API Request Failed with status ${status || "Unknown"}`,
          );
          (customError as any).status = status;
          (customError as any).response = error.response;
          throw customError;
        }

        // ネットワークエラーなど
        console.error("[useApi] Network or other unexpected error:", error);
        throw error;
      }
    },
    [user, logout, isLoggingOut], // 依存配列: user/logout/isLoggingOut が変わったら関数を再生成
  );

  // --- プロファイル更新専用ラッパー ---
  const updateProfile = useCallback(
    async (data: ProfileForm): Promise<UpdatedUserResponse> => {
      const response = await authenticatedFetch("/mypage/profile_update", {
        method: "PATCH",
        data: data,
      });

      if (response && response.user) {
        return response.user as UpdatedUserResponse;
      }

      throw new Error("Profile update failed: Invalid response structure.");
    },
    [authenticatedFetch], // 依存配列
  );

  // --- 画像アップロード専用ラッパー ---
  const uploadImage = useCallback(
    async (
      formData: FormData,
      url: string = "/upload2",
    ): Promise<UpdatedUserResponse> => {
      // FormDataを送信する際、Content-Type: undefined とすることで、
      // Axiosが自動的に適切な 'multipart/form-data' ヘッダーを生成する
      const response = await authenticatedFetch(url, {
        method: "POST",
        data: formData, // FormDataは 'data' に設定
        headers: {
          "Content-Type": undefined, // ★重要: これにより自動的にマルチパート設定される
        },
      });

      if (response && response.user) {
        return response.user as UpdatedUserResponse;
      }

      throw new Error("Image upload failed: Invalid response structure.");
    },
    [authenticatedFetch], // 依存配列
  );

  return {
    authenticatedFetch, // 汎用認証リクエスト関数
    updateProfile, // プロファイル更新用
    uploadImage, // 画像アップロード用
  };
}
