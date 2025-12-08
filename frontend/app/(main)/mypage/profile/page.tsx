"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useSanctumAuth";
import { getImageUrl, IMAGE_TYPE } from "@/utils/utils";

/* ------------------------------------
  型定義
------------------------------------ */
interface User {
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

/* =============================================
   ProfilePage
============================================= */
export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* 認証 */
  const {
    user: authUser,
    isAuthenticated,
    isLoading: isAuthLoading,
    logout,
    reloadAuthToken,
    apiClient,
  } = useAuth();

  console.log("🔥 ProfilePage: 初期レンダリング");
  console.log("authUser =", authUser);
  console.log("isAuthenticated =", isAuthenticated);
  console.log("isAuthLoading =", isAuthLoading);

  /* 状態管理 */
  const [user, setUser] = useState<User | null>(null);
  const [isVerifiedSyncing, setIsVerifiedSyncing] = useState(false); // ← 認証同期中

  const [form, setForm] = useState({
    name: "",
    post_number: "",
    address: "",
    building: "",
  });

  const [profileErrors, setProfileErrors] = useState<any>({});
  const [imageError, setImageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);

  /* メール認証リダイレクト判定 */
  const isVerificationRedirect = useMemo(
    () => searchParams.get("verified") === "true",
    [searchParams],
  );

  console.log("🔍 verified flag =", isVerificationRedirect);

  /* プロフィール画像（キャッシュバスター付き） */
  const profileImageUrl = useMemo(() => {
    return getImageUrl(user?.user_image ?? null, IMAGE_TYPE.USER, Date.now());
  }, [user?.user_image]);

  /* ------------------------------------
     APIデータ → state 初期化
  ------------------------------------ */
  const initializeUserData = useCallback((src: any) => {
    console.log("🟦 initializeUserData:", src);

    const data = src?.user ?? src;

    setUser(data);
    setForm({
      name: data.name || "",
      post_number: data.post_number || "",
      address: data.address || "",
      building: data.building || "",
    });
  }, []);

  /* ------------------------------------
     プロフィール読み込み
  ------------------------------------ */
  const fetchUserProfile = useCallback(
    async (isRetry = false) => {
      if (!apiClient) {
        console.log("⚠️ fetchUserProfile: apiClient が null");
        return;
      }

      if (!isRetry) setIsFetching(true);

      console.log("🟦 fetchUserProfile(): START isRetry =", isRetry);

      try {
        const res = await apiClient.get("/api/mypage/profile");
        console.log("🟩 fetchUserProfile(): SUCCESS →", res.data);

        initializeUserData(res.data);

        if (isRetry) {
          setIsRecovering(false);
          setSuccessMessage("認証情報再構築 → データ再取得成功");
        }

        setIsLoading(false);
      } catch (err: any) {
        console.log("❌ fetchUserProfile(): ERROR", err);

        const status = err?.response?.status;

        // --- 認証切れ（401）
        if (status === 401) {
          console.log("⚠️ 401 → reloadAuthToken 実行");

          if (isRetry) {
            console.log("❌ retry 後も 401 → logout");
            await logout();
            return;
          }

          setIsRecovering(true);
          setSuccessMessage("セッション期限切れ → 再認証中...");

          try {
            await reloadAuthToken();
            await fetchUserProfile(true);
          } catch (e) {
            console.log("❌ reloadAuthToken エラー → logout");
            await logout();
          }
          return;
        }

        setIsLoading(false);
      } finally {
        if (!isRetry) setIsFetching(false);
      }
    },
    [apiClient, initializeUserData, logout, reloadAuthToken],
  );

  /* ------------------------------------
     🔥 Step 1：新規登録直後 verified=true を検知して同期
  ------------------------------------ */
  useEffect(() => {
    if (!isVerificationRedirect) return;

    console.log("🔥 verified=true detected → reloadAuthToken を実行");

    setIsVerifiedSyncing(true);

    (async () => {
      try {
        await reloadAuthToken(); // ← Laravel 側の最新ユーザー取得
        console.log("🟩 reloadAuthToken: SUCCESS");

        if (apiClient) {
          await fetchUserProfile(true); // ← プロフィール再取得
        }
      } catch (err) {
        console.log("❌ verified sync error:", err);
      } finally {
        setIsVerifiedSyncing(false);
        setIsLoading(false);
      }
    })();
  }, [isVerificationRedirect, reloadAuthToken, fetchUserProfile, apiClient]);

  /* ------------------------------------
     初期データフェッチ（通常ルート）
  ------------------------------------ */
  useEffect(() => {
    if (isAuthLoading || isRecovering || isVerifiedSyncing) {
      console.log(
        "⏳ 認証ローディング中 or 再認証中 → fetchUserProfile 実行しない",
      );
      return;
    }

    if (!isAuthenticated) {
      console.log("❌ isAuthenticated=false → /login へリダイレクト");
      router.replace("/login");
      return;
    }

    if (isAuthenticated && apiClient && !user && !isFetching) {
      console.log("🔄 fetchUserProfile を通常実行");
      fetchUserProfile();
    }
  }, [
    isAuthLoading,
    isAuthenticated,
    isRecovering,
    isVerifiedSyncing,
    authUser,
    apiClient,
    user,
    isFetching,
    router,
    fetchUserProfile,
  ]);

  /* ------------------------------------
     ローディング表示
  ------------------------------------ */
  if (isAuthLoading || isLoading || isRecovering || isVerifiedSyncing) {
    console.log("⏳ ProfilePage: Loading UI 表示中...");

    return (
      <div className="login_page max-w-[1400px] mx-auto pt-5 pb-10">
        <h2 className="title">プロフィール設定</h2>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-500 mt-3">ロード中...</p>
        </div>
      </div>
    );
  }

  /* ------------------------------------
     認証エラー
  ------------------------------------ */
  if (!isAuthenticated || !user) {
    console.log("❌ 認証エラー → Loginへ誘導");
    return (
      <div className="login_page max-w-[1400px] mx-auto pt-5 pb-10">
        <h2 className="title">プロフィール設定</h2>
        <p>認証エラー。ログインし直してください。</p>
      </div>
    );
  }

  /* ------------------------------------
     メイン UI
  ------------------------------------ */
  console.log("🟩 ProfilePage: メインUIレンダリング user =", user);

  return (
    <div className="login_page max-w-[1400px] mx-auto pt-5 pb-10">
      <h2 className="title">プロフィール設定</h2>

      <div className="form-wrapper">
        {successMessage && (
          <div className="alert-success2">{successMessage}</div>
        )}

        {/* =========================== */}
        {/* 画像フォーム */}
        {/* =========================== */}
        <form className="item_sell_contents_box_line">
          <div className="image_name">
            <div className="image_button_row">
              <img
                key={user.user_image || "default"}
                src={profileImageUrl}
                alt="プロフィール画像"
                className="user_image_css"
              />
              <button
                type="button"
                className="upload_submit"
                onClick={() => fileInput.current?.click()}
              >
                画像を選択する
              </button>
            </div>

            <input
              type="file"
              ref={fileInput}
              style={{ display: "none" }}
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !apiClient) return;

                setIsLoading(true);
                setImageError("");

                const formData = new FormData();
                formData.append("user_image", file);

                try {
                  const res = await apiClient.post(
                    "/api/profile/image",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } },
                  );

                  setUser(res.data.user);
                  setSuccessMessage("画像が更新されました！");
                } catch (err: any) {
                  console.log("❌ Image upload error:", err);
                  setImageError("アップロードに失敗しました");
                } finally {
                  setIsLoading(false);
                  if (fileInput.current) fileInput.current.value = "";
                }
              }}
            />
          </div>

          <div className="user_image_error">{imageError}</div>
        </form>

        {/* =========================== */}
        {/* プロフィール編集 */}
        {/* =========================== */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!apiClient) return;

            setProfileErrors({});
            setSuccessMessage("");
            setIsLoading(true);

            try {
              const res = await apiClient.patch("/api/profile", form);
              initializeUserData(res.data);
              setSuccessMessage("プロフィール情報を更新しました！");
            } catch (err: any) {
              console.log("❌ Profile update error", err);

              if (err.response?.status === 422) {
                setProfileErrors(err.response.data.errors);
              } else {
                setSuccessMessage("エラーが発生しました。再試行してください。");
              }
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {/* 名前 */}
          <div className="form-group">
            <label>ユーザー名</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
            <div className="error">{profileErrors?.name?.[0]}</div>
          </div>

          {/* 郵便番号 */}
          <div className="form-group">
            <label>郵便番号</label>
            <input
              type="text"
              value={form.post_number}
              onChange={(e) =>
                setForm((p) => ({ ...p, post_number: e.target.value }))
              }
            />
            <div className="error">{profileErrors?.post_number?.[0]}</div>
          </div>

          {/* 住所 */}
          <div className="form-group">
            <label>住所</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
            />
            <div className="error">{profileErrors?.address?.[0]}</div>
          </div>

          {/* 建物名 */}
          <div className="form-group">
            <label>建物名</label>
            <input
              type="text"
              value={form.building}
              onChange={(e) =>
                setForm((p) => ({ ...p, building: e.target.value }))
              }
            />
            <div className="error">{profileErrors?.building?.[0]}</div>
          </div>

          <button className="submit_form" type="submit">
            更新する
          </button>
        </form>
      </div>
    </div>
  );
}
