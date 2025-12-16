"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/ui/auth/useAuth";
import { useUserProfileSWR } from "@/services/useUserProfileSWR";

import styles from "./W-Purchase-Address.module.css";

type AddressForm = {
  postNumber: string;
  address: string;
  building: string;
};

export default function PurchaseAddressPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: isAuthLoading, apiClient } = useAuth();

  /* =========================
     🧩 itemId（戻り用）
  ========================= */
  const itemId = useMemo(() => {
    const raw = params.item_id;
    const id = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
  }, [params.item_id]);

  /* =========================
     📦 Profile
  ========================= */
  const { profile, isLoading: isProfileLoading } = useUserProfileSWR();

  const [form, setForm] = useState<AddressForm>({
    postNumber: "",
    address: "",
    building: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     初期値反映
  ========================= */
  useEffect(() => {
    if (!profile) return;

    setForm({
      postNumber: profile.postNumber ?? "",
      address: profile.address ?? "",
      building: profile.building ?? "",
    });
  }, [profile]);

  const isPageLoading = isAuthLoading || isProfileLoading;

  /* =========================
     更新処理
  ========================= */
  const submitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient) return;

    setIsSubmitting(true);
    setError("");

    try {
      await apiClient.patch("/profile", {
        post_number: form.postNumber,
        address: form.address,
        building: form.building,
      });

      router.push(`/purchase/${itemId}`);
    } catch (err: any) {
      setError("住所の更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     Guard
  ========================= */
  if (isPageLoading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>配送先住所の変更</h2>

      <form onSubmit={submitAddress} className={styles.form}>
        {/* 郵便番号 */}
        <div className={styles.formGroup}>
          <label>郵便番号</label>
          <input
            type="text"
            value={form.postNumber}
            placeholder="例: 100-0001"
            onChange={(e) =>
              setForm((v) => ({ ...v, postNumber: e.target.value }))
            }
          />
        </div>

        {/* 住所 */}
        <div className={styles.formGroup}>
          <label>住所</label>
          <input
            type="text"
            value={form.address}
            placeholder="都道府県・市区町村"
            onChange={(e) =>
              setForm((v) => ({ ...v, address: e.target.value }))
            }
          />
        </div>

        {/* 建物名 */}
        <div className={styles.formGroup}>
          <label>建物名</label>
          <input
            type="text"
            value={form.building}
            placeholder="建物名・部屋番号"
            onChange={(e) =>
              setForm((v) => ({ ...v, building: e.target.value }))
            }
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={() => router.back()}
          >
            戻る
          </button>

          <button
            type="submit"
            className={styles.submit}
            disabled={isSubmitting}
          >
            更新する
          </button>
        </div>
      </form>
    </div>
  );
}
