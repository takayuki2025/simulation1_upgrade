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

  /* 状態管理 */
  const [user, setUser] = useState<User | null>(null);

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

  /* メール検証リダイレクト判定 */
  const isVerificationRedirect = useMemo(
    () => searchParams.get("verified") === "true",
    [searchParams],
  );

  /* プロフィール画像（キャッシュバスター付き） */
  const profileImageUrl = useMemo(() => {
    return getImageUrl(
      user?.user_image ?? null,
      IMAGE_TYPE.USER,
      Date.now(), // キャッシュ避け
    );
  }, [user?.user_image]);

  /* ------------------------------------
     APIデータ → state 初期化
  ------------------------------------ */
  const initializeUserData = useCallback((src: any) => {
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
      if (!apiClient) return;

      if (!isRetry) setIsFetching(true);
      try {
        const res = await apiClient.get("/api/mypage/profile");
        initializeUserData(res.data);

        if (isRetry) {
          setIsRecovering(false);
          setSuccessMessage("認証情報再構築 → データ再取得成功");
        }

        setIsLoading(false);
      } catch (err: any) {
        const status = err?.response?.status;

        // --- 認証切れ（401） → トークン再取得
        if (status === 401) {
          if (isRetry) {
            await logout();
            return;
          }

          setIsRecovering(true);
          setSuccessMessage("セッション期限切れ → 再認証中...");

          try {
            await reloadAuthToken();
            await fetchUserProfile(true);
          } catch (e) {
            await logout();
          }
          return;
        }

        console.error("[Profile Load] Error:", err);
        setIsLoading(false);
      } finally {
        if (!isRetry) setIsFetching(false);
      }
    },
    [apiClient, initializeUserData, logout, reloadAuthToken],
  );

  /* ------------------------------------
     初期データフェッチ
  ------------------------------------ */
  useEffect(() => {
    if (isAuthLoading || isRecovering) return;

    if (!isAuthenticated) {
      if (!authUser) router.replace("/login");
      return;
    }

    if (isAuthenticated && apiClient && !user && !isFetching) {
      fetchUserProfile();
    }
  }, [
    isAuthLoading,
    isAuthenticated,
    authUser,
    apiClient,
    user,
    isFetching,
    isRecovering,
    router,
    fetchUserProfile,
  ]);

  /* ------------------------------------
     プロフィール画像アップロード
  ------------------------------------ */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !apiClient) return;

    setImageError("");
    setSuccessMessage("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("user_image", file);

    try {
      const res = await apiClient.post("/api/profile/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = res.data.user;
      setUser(updated);
      setSuccessMessage("画像が更新されました！");
    } catch (err: any) {
      const status = err.response?.status;

      if (status === 401) {
        await logout();
        return;
      }

      if (status === 422) {
        setImageError(err.response.data.errors.user_image[0]);
      } else {
        setImageError("アップロードに失敗しました");
      }
    } finally {
      setIsLoading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  /* ------------------------------------
     プロフィール更新
  ------------------------------------ */
  const handleProfileUpdate = async (e: React.FormEvent) => {
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
      const status = err?.response?.status;

      if (status === 401) {
        await logout();
        return;
      }

      if (status === 422) {
        setProfileErrors(err.response.data.errors);
      } else {
        setSuccessMessage("エラーが発生しました。再試行してください。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------
     ローディング表示
  ------------------------------------ */
  if (isAuthLoading || isLoading || isRecovering) {
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

  if (!isAuthenticated || !user) {
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
  return (
    <div className="login_page max-w-[1400px] mx-auto pt-5 pb-10">
      <h2 className="title">プロフィール設定</h2>

      <div className="form-wrapper">

        {successMessage && (
          <div className="alert-success2">{successMessage}</div>
        )}

        {/* 画像フォーム */}
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
              onChange={handleImageUpload}
            />
          </div>

          <div className="user_image_error">{imageError}</div>
        </form>

        {/* プロフィール編集 */}
        <form onSubmit={handleProfileUpdate}>
          {/* 名前 */}
          <div className="form-group">
            <label>ユーザー名</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
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

