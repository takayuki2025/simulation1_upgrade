"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";

import { useAuth } from "@/hooks/useSanctumAuth";
import { getImageUrl, IMAGE_TYPE } from "@/utils/utils";

/* ============================================================
   型定義
============================================================ */
interface ProfileUser {
  id: number;
  name: string;
  email: string;
  uid?: string;
  email_verified_at: string | null;
  post_number: string | null;
  address: string | null;
  building: string | null;
  user_image?: string | null;
}

interface ProfileForm {
  name: string;
  post_number: string;
  address: string;
  building: string;
}

type ProfileErrors = {
  [K in keyof ProfileForm]?: string[];
} & {
  user_image?: string[];
};

/* ============================================================
   ProfilePage（Origin 統一版）
============================================================ */
export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    user: authUser,
    firebaseUser,
    apiClient,
    isAuthenticated,
    isLoading: isAuthLoading,
    reloadAuthToken,
    logout,
  } = useAuth();

  // ⚠️ メール認証完了後のフラグ
  const isVerificationRedirect = useMemo(
    () => searchParams.get("verified") === "true",
    [searchParams],
  );

  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    post_number: "",
    address: "",
    building: "",
  });

  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [imageError, setImageError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isRecovering, setIsRecovering] = useState<boolean>(false);

  // 🚩 修正ポイント 1：メール認証後の reloadAuthToken を「確実に一度だけ実行する」
  const verificationHandledRef = useRef<boolean>(false);

  // 🚩 修正ポイント 2：401 の回復処理が無限に走らないように制御
  const recoveryTriedRef = useRef<boolean>(false);

  console.log("🔥 ProfilePage Mounted");
  console.log("authUser=", authUser);
  console.log("firebaseUser=", firebaseUser);
  console.log("isAuthenticated=", isAuthenticated);
  console.log("isVerificationRedirect=", isVerificationRedirect);

  /* ============================================================
     画像 URL（キャッシュバスター付き）
  ============================================================ */
  const profileImageUrl = useMemo(() => {
    return getImageUrl(
      profileUser?.user_image ?? null,
      IMAGE_TYPE.USER,
      Date.now(),
    );
  }, [profileUser?.user_image]);

  /* ============================================================
     API レスポンスを state に反映
  ============================================================ */
  const initializeProfileFromResponse = useCallback((src: any) => {
    const data: ProfileUser = src?.user ?? src;

    setProfileUser(data);
    setForm({
      name: data.name ?? "",
      post_number: data.post_number ?? "",
      address: data.address ?? "",
      building: data.building ?? "",
    });
  }, []);

  /* ============================================================
     1. プロフィール取得 API
  ============================================================ */
  const fetchUserProfile = useCallback(
    async (isRetry = false) => {
      if (!apiClient) return;

      if (!isRetry) {
        setIsFetching(true);
        setSuccessMessage("");
        setProfileErrors({});
      }

      console.log("[Profile] fetchUserProfile 開始");

      try {
        const res = await apiClient.get("/mypage/profile");
        initializeProfileFromResponse(res.data);

        setIsLoading(false);
        setIsRecovering(false);
      } catch (err) {
        const axiosErr = err as AxiosError<any>;
        const status = axiosErr.response?.status;

        console.error("[Profile] fetch error:", status);

        if (status === 401 && !recoveryTriedRef.current) {
          recoveryTriedRef.current = true;
          setIsRecovering(true);

          try {
            console.log("[Profile] 401 → reloadAuthToken 実行");
            await reloadAuthToken();

            console.log("[Profile] 401 → 回復成功 → 再フェッチ");
            await fetchUserProfile(true);
            return;
          } catch {
            console.error("[Profile] 401 → 回復失敗");
            await logout();
            router.replace("/login");
            return;
          }
        }

        if (status === 401) {
          await logout();
          router.replace("/login");
          return;
        }

        setIsLoading(false);
      } finally {
        if (!isRetry) setIsFetching(false);
      }
    },
    [apiClient, initializeProfileFromResponse, reloadAuthToken, logout, router],
  );

  /* ============================================================
     2. メール認証完了後の「必ず reloadAuthToken()」処理
     🚩 これがあなたの環境で動いていなかった → 今回の最大修正点
  ============================================================ */
  useEffect(() => {
    if (!isVerificationRedirect) return;

    // すでに実行済みならスキップ
    if (verificationHandledRef.current) return;

    // firebaseUser がまだ来ていない場合は待つ（ここが前回バグの原因）
    if (!firebaseUser) {
      console.log("[Profile] verified=true だが firebaseUser 未到達 → wait");
      return;
    }

    // 1回だけ実行
    verificationHandledRef.current = true;

    const run = async () => {
      console.log("🔥 verified=true → reloadAuthToken() 実行！");
      setIsRecovering(true);

      try {
        await reloadAuthToken();
        console.log("🔥 verified=true → reloadAuthToken SUCCESS");
      } catch (err) {
        console.error("reloadAuthToken 失敗:", err);
        setSuccessMessage(
          "メール認証後のログイン状態の復元に失敗しました。再ログインしてください。",
        );
      } finally {
        setIsRecovering(false);
      }
    };

    void run();
  }, [isVerificationRedirect, firebaseUser, reloadAuthToken]);

  /* ============================================================
     3. 初回プロフィール取得（通常 or 回復後）
  ============================================================ */
  useEffect(() => {
    if (isAuthLoading || isRecovering) return;

    // token 未生成 → verified=true の回復を待つ
    if (!isAuthenticated || !apiClient) {
      if (!firebaseUser) {
        router.replace("/login");
      }
      return;
    }

    if (!profileUser && !isFetching) {
      console.log("🔥 fetchUserProfile 実行");
      void fetchUserProfile();
    }
  }, [
    isAuthLoading,
    isRecovering,
    isAuthenticated,
    apiClient,
    firebaseUser,
    profileUser,
    isFetching,
    fetchUserProfile,
    router,
  ]);

  /* ============================================================
     画像アップロード
  ============================================================ */
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !apiClient) return;

    setImageError("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("user_image", file);

    try {
      const res = await apiClient.post("/profile/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      initializeProfileFromResponse(res.data);
      setSuccessMessage("画像を更新しました！");
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.user_image?.[0] ??
        "画像アップロードに失敗しました。";
      setImageError(msg);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /* --------------------------------------------------------
     プロフィール更新
  -------------------------------------------------------- */
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient) return;

    setProfileErrors({});
    setIsLoading(true);

    try {
      const res = await apiClient.patch("/profile", form);
      initializeProfileFromResponse(res.data);
      setSuccessMessage("プロフィールを更新しました！");
    } catch (err: any) {
      const status = err.response?.status;

      if (status === 422) {
        setProfileErrors(err.response?.data?.errors ?? {});
      } else if (status === 401) {
        await logout();
        router.replace("/login");
      } else {
        setSuccessMessage("更新時にエラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================================================
     ローディング UI
  ============================================================ */
  if (isAuthLoading || isLoading || isRecovering) {
    return (
      <div className="login_page max-w-[1400px] mx-auto pt-5 pb-10">
        <h2 className="title">プロフィール設定</h2>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-500 mt-3">
            {isRecovering ? "セッションを再同期しています..." : "読み込み中..."}
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     エラー
  ============================================================ */
  if (!isAuthenticated || !profileUser) {
    return (
      <div className="login_page max-w-[1400px] mx-auto pt-5 pb-10">
        <h2 className="title">プロフィール設定</h2>
        <p>認証エラーが発生しました。ログインし直してください。</p>
      </div>
    );
  }

  /* ============================================================
     メイン UI（デザイン変更なし）
  ============================================================ */
  return (
    <div className="login_page max-w-[1400px] mx-auto pt-5 pb-10">
      <h2 className="title">プロフィール設定</h2>

      <div className="form-wrapper">
        {successMessage && (
          <div className="alert-success2">{successMessage}</div>
        )}

        {/* プロフィール画像 */}
        <form className="item_sell_contents_box_line">
          <div className="image_name">
            <div className="image_button_row">
              <img
                key={profileUser.user_image || "default"}
                src={profileImageUrl}
                alt="プロフィール画像"
                className="user_image_css"
              />
              <button
                type="button"
                className="upload_submit"
                onClick={() => fileInputRef.current?.click()}
              >
                画像を選択する
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {imageError && (
            <div className="user_image_error text-red-600">{imageError}</div>
          )}
        </form>

        {/* プロフィールフォーム */}
        <form onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label>ユーザー名</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <div className="error">{profileErrors?.name?.[0]}</div>
          </div>

          <div className="form-group">
            <label>郵便番号</label>
            <input
              type="text"
              value={form.post_number}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, post_number: e.target.value }))
              }
            />
            <div className="error">{profileErrors?.post_number?.[0]}</div>
          </div>

          <div className="form-group">
            <label>住所</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
              }
            />
            <div className="error">{profileErrors?.address?.[0]}</div>
          </div>

          <div className="form-group">
            <label>建物名</label>
            <input
              type="text"
              value={form.building}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, building: e.target.value }))
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
