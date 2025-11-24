"use client";

import { useCallback } from "react";
// axios の型を正しくインポート
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useAuth } from "./useAuth"; // useAuthフックのパスを調整してください

// Next.jsの環境変数を使用
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// =======================================================
// 型定義
// =======================================================

/**
 * 💡 修正点 1: AxiosRequestConfigを拡張し、カスタムプロパティ'body'を許容
 * プロパティ 'body' は型 'AxiosRequestConfig<any>' に存在しません。 (ts(2339)) を解消
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
  // useAuth から logout と isLoggingOut を取得
  const { user, logout, isLoggingOut } = useAuth();

  /**
   * 認証済みのAPIリクエストを実行する汎用関数
   * @param url リクエストURL（API BASE URLからの相対パス）
   * @param config Axiosリクエスト設定
   * @returns APIレスポンスデータ
   */
  const authenticatedFetch = useCallback(
    async (
      url: string,
      config: CustomAxiosRequestConfig = {}
    ): Promise<any> => {
      if (isLoggingOut) {
        throw new Error("Logging out, cannot perform API request.");
      }

      // ユーザーオブジェクトが存在しない場合は即座に認証エラー
      if (!user) {
        console.error("[useApi] User object missing. Forcing logout.");
        await logout();
        throw new Error("User not authenticated.");
      }

      // --- 最新のFirebase ID Tokenを強制的に取得 ---
      let idToken: string;
      try {
        // getIdToken(true): キャッシュを無視して、Firebaseから強制的に最新のトークンを取得
        idToken = await user.getIdToken(true);
        console.log(
          `[useApi] Token acquired. Starts with: ${idToken.substring(0, 10)}...`
        );
      } catch (e) {
        console.error(
          "[useApi] Failed to refresh/get ID Token. Forcing logout.",
          e
        );
        await logout();
        throw new Error("Failed to retrieve fresh authentication token.");
      }
      // ----------------------------------------

      // --- URLプレフィックスのロジック (現状維持) ---
      let apiPath = url.startsWith("/api/") ? url : `/api${url}`;
      apiPath = apiPath.replace(/\/\/+/g, "/");
      // ----------------------------------------

      // ★★★ 修正箇所: ヘッダーマージロジックを修正し、Authorizationを最後に設定 ★★★
      const baseHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      // 1. デフォルトヘッダーと、configから渡されたヘッダーをマージ
      const mergedHeaders = {
        ...baseHeaders,
        ...config.headers,
      };

      // 2. 最後に、トークンを確実に設定（他のヘッダーで上書きされないようにする）
      const finalHeaders = {
        ...mergedHeaders,
        Authorization: `Bearer ${idToken}`, // ここで必ずトークンを設定する
        "X-Firebase-Token": idToken,
      };

      // 💡 修正点 2: delete演算子のエラー (ts(2790)) を解消するためにキャストを使用
      // 3. FormDataを使用する場合に Content-Type: undefined のエントリを削除する
      if (finalHeaders["Content-Type"] === undefined) {
        // 'as any' を使用して、型チェックを一時的に無効にする
        delete (finalHeaders as any)["Content-Type"];
      }

      const headers = finalHeaders; // 最終的なヘッダー

      // デバッグログ (★ここでAuthorizationヘッダーが正しく設定されているか確認)
      console.log("[useApi] Request Headers being sent:", headers);
      // ★★★ 修正箇所ここまで ★★★

      try {
        const response = await axios({
          method: config.method || "GET",
          url: `${API_BASE_URL}${apiPath}`,
          // AxiosConfigのdataとbodyの扱いを統一
          data: config.data || config.body,
          params: config.params,
          headers: headers,
          withCredentials: true,
        });

        return response.data;
      } catch (error: any) {
        // AxiosError の型ガード
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;

          if (status === 401) {
            console.error(
              "[useApi] 401 Unauthorized detected. Throwing error for page recovery (reloadAuthToken)."
            );
            // ログアウトせず、エラーをスローして呼び出し元（ProfilePage.tsx）の catch に渡す
            const customError = new Error(`API Request Failed with status 401`);
            (customError as any).status = 401;
            (customError as any).response = error.response;
            throw customError;
          }

          // 401以外のエラーもカスタムエラーとしてスロー
          const customError = new Error(
            `API Request Failed with status ${status || "Unknown"}`
          );
          (customError as any).status = status;
          (customError as any).response = error.response;
          throw customError;
        }

        // ネットワークエラーなど (AxiosErrorではない場合)
        console.error("[useApi] Network or other unexpected error:", error);
        throw error;
      }
    },
    [user, logout, isLoggingOut] // 依存配列
  );

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
    [authenticatedFetch]
  );

  const uploadImage = useCallback(
    async (
      formData: FormData,
      url: string = "/upload2"
    ): Promise<UpdatedUserResponse> => {
      // 画像アップロード時には、axiosのContent-Typeをundefinedに設定することで、
      // 適切なBoundaryを持つ multipart/form-data ヘッダーが自動で設定されるようにする
      const response = await authenticatedFetch(url, {
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": undefined,
        },
      });

      if (response && response.user) {
        return response.user as UpdatedUserResponse;
      }

      throw new Error("Image upload failed: Invalid response structure.");
    },
    [authenticatedFetch]
  );

  return {
    authenticatedFetch,
    updateProfile,
    uploadImage,
  };
}
