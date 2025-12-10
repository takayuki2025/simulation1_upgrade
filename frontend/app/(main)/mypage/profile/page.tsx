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
import styles from "./W-ProfilePage.module.css";

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
   ProfilePage（CSS Modules 完全対応版）
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

  const verificationHandledRef = useRef<boolean>(false);
  const recoveryTriedRef = useRef<boolean>(false);

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
     API レスポンス反映
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
     プロフィール取得
  ============================================================ */
  const fetchUserProfile = useCallback(
    async (isRetry = false) => {
      if (!apiClient) return;

      if (!isRetry) {
        setIsFetching(true);
        setSuccessMessage("");
        setProfileErrors({});
      }

      try {
        const res = await apiClient.get("/mypage/profile");
        initializeProfileFromResponse(res.data);

        setIsLoading(false);
        setIsRecovering(false);
      } catch (err) {
        const axiosErr = err as AxiosError<any>;
        const status = axiosErr.response?.status;

        if (status === 401 && !recoveryTriedRef.current) {
          recoveryTriedRef.current = true;
          setIsRecovering(true);

          try {
            await reloadAuthToken();
            await fetchUserProfile(true);
            return;
          } catch {
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
     メール認証後 reloadAuthToken
  ============================================================ */
  useEffect(() => {
    if (!isVerificationRedirect) return;
    if (verificationHandledRef.current) return;

    if (!firebaseUser) return;

    verificationHandledRef.current = true;

    const run = async () => {
      try {
        setIsRecovering(true);
        await reloadAuthToken();
      } finally {
        setIsRecovering(false);
      }
    };
    run();
  }, [isVerificationRedirect, firebaseUser, reloadAuthToken]);

  /* ============================================================
     初回プロフィール取得
  ============================================================ */
  useEffect(() => {
    if (isAuthLoading || isRecovering) return;

    if (!isAuthenticated || !apiClient) {
      if (!firebaseUser) router.replace("/login");
      return;
    }

    if (!profileUser && !isFetching) {
      fetchUserProfile();
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

  /* ============================================================
     プロフィール更新
  ============================================================ */
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
     ローディング
  ============================================================ */
  if (isAuthLoading || isLoading || isRecovering) {
    return (
      <div className={`${styles.login_page} max-w-[1400px] mx-auto pt-5 pb-10`}>
        <h2 className={styles.title}>プロフィール設定</h2>
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
     認証エラー
  ============================================================ */
  if (!isAuthenticated || !profileUser) {
    return (
      <div className={`${styles.login_page} max-w-[1400px] mx-auto pt-5 pb-10`}>
        <h2 className={styles.title}>プロフィール設定</h2>
        <p>認証エラーが発生しました。ログインし直してください。</p>
      </div>
    );
  }

  /* ============================================================
     メイン UI（CSS Modules 適用）
  ============================================================ */
  return (
    <div
      className={`${styles.login_page} max-w-[1400px] mx-auto pt-5 pb-10`}
      key={authUser?.id || "unauthenticated"}
    >
      <h2 className={styles.title}>プロフィール設定</h2>

      <div className={styles["form-wrapper"]}>
        {successMessage && (
          <div className={styles["alert-success2"]}>{successMessage}</div>
        )}

        {/* --- 画像アップロード --- */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className={styles.item_sell_contents_box_line}
        >
          <div className={styles.image_name}>
            <div className={styles.image_button_row}>
              <img
                key={profileUser.user_image || "default"}
                src={profileImageUrl}
                alt="プロフィール画像"
                className={styles.user_image_css}
              />
              <button
                type="button"
                className={styles.upload_submit}
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                画像を選択する
              </button>
            </div>

            <input
              type="file"
              name="user_image"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>

          <div className={styles.user_image_error_message}>{imageError}</div>
        </form>

        {/* --- プロフィール更新フォーム --- */}
        <form onSubmit={handleProfileUpdate}>
          {/* ユーザー名 */}
          <div className={styles["form-group"]}>
            <label htmlFor="name" className={styles.label_form_1}>
              ユーザー名
            </label>
            <input
              id="name"
              type="text"
              className={styles.name_form}
              name="name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <div className={styles.profile__error}>
              {profileErrors.name ? profileErrors.name[0] : ""}
            </div>
          </div>

          {/* 郵便番号 */}
          <div className={styles["form-group"]}>
            <label htmlFor="post_number" className={styles.label_form_2}>
              郵便番号 (8桁、ハイフンあり)
            </label>
            <input
              id="post_number"
              type="text"
              className={styles.email_form}
              name="post_number"
              value={form.post_number}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, post_number: e.target.value }))
              }
              placeholder="例: 100-0001"
              maxLength={8}
            />
            <div className={styles.profile__error}>
              {profileErrors.post_number ? profileErrors.post_number[0] : ""}
            </div>
          </div>

          {/* 住所 */}
          <div className={styles["form-group"]}>
            <label htmlFor="address" className={styles.label_form_3}>
              住所
            </label>
            <input
              id="address"
              type="text"
              className={styles.password_form}
              name="address"
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="手動で入力してください"
            />
            <div className={styles.profile__error}>
              {profileErrors.address ? profileErrors.address[0] : ""}
            </div>
          </div>

          {/* 建物名 */}
          <div className={styles["form-group"]}>
            <label htmlFor="building" className={styles.label_form_4}>
              建物名
            </label>
            <input
              id="building"
              type="text"
              className={styles.password_form}
              name="building"
              value={form.building}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, building: e.target.value }))
              }
            />
            <div className={styles.profile__error}>
              {profileErrors.building ? profileErrors.building[0] : ""}
            </div>
          </div>

          <div className={styles.submit}>
            <input
              type="submit"
              className={styles.submit_form}
              value="更新する"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
