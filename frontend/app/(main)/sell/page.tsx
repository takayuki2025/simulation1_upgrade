"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/ui/auth/useAuth";
import styles from "./W-Item-Sell.module.css";

type SellForm = {
  name: string;
  price: string;
  explain: string;
};

export default function ItemSellPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, apiClient } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<SellForm>({
    name: "",
    price: "",
    explain: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     Guard
  ========================= */
  if (!isLoading && !isAuthenticated) {
    router.replace("/login");
    return null;
  }

  /* =========================
     Image Select
  ========================= */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  /* =========================
     Submit
  ========================= */
  const submitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient) return;

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("explain", form.explain);

      if (imageFile) {
        formData.append("item_image", imageFile);
      }

      await apiClient.post("/item", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/mypage/sell");
    } catch (err) {
      setError("商品の出品に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>商品の出品</h2>

      <form onSubmit={submitItem} className={styles.form}>
        {/* 画像 */}
        <div className={styles.imageBox}>
          {previewUrl ? (
            <img src={previewUrl} className={styles.preview} />
          ) : (
            <div className={styles.imagePlaceholder}>画像を選択</div>
          )}

          <button
            type="button"
            className={styles.imageButton}
            onClick={() => fileInputRef.current?.click()}
          >
            画像を選択する
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </div>

        {/* 商品名 */}
        <div className={styles.formGroup}>
          <label>商品名</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
            required
          />
        </div>

        {/* 価格 */}
        <div className={styles.formGroup}>
          <label>価格</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm((v) => ({ ...v, price: e.target.value }))}
            placeholder="¥"
            required
          />
        </div>

        {/* 説明 */}
        <div className={styles.formGroup}>
          <label>商品説明</label>
          <textarea
            rows={6}
            value={form.explain}
            onChange={(e) =>
              setForm((v) => ({ ...v, explain: e.target.value }))
            }
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="submit" disabled={isSubmitting}>
            出品する
          </button>
        </div>
      </form>
    </div>
  );
}
