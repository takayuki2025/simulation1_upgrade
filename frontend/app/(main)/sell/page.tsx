"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/ui/auth/useAuth";
import styles from "./W-Item-Sell.module.css";

/* =========================
   型定義
========================= */
type SellForm = {
  name: string;
  price: string;
  explain: string;
  brand: string;
  condition: string;
  categories: string[];
};

/* =========================
   定数
========================= */
const CATEGORY_LIST = [
  "ファッション",
  "家電",
  "インテリア",
  "レディース",
  "メンズ",
  "コスメ",
  "本",
  "ゲーム",
  "スポーツ",
  "キッチン",
  "ハンドメイド",
  "アクセサリー",
];

const CONDITION_LIST = [
  "良好",
  "目立った傷や汚れなし",
  "やや傷や汚れあり",
  "状態が悪い",
];

export default function ItemSellPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, apiClient } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<SellForm>({
    name: "",
    price: "",
    explain: "",
    brand: "",
    condition: "",
    categories: [],
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
     Category Toggle
  ========================= */
  const toggleCategory = (category: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
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
      formData.append("brand", form.brand);
      formData.append("condition", form.condition);
      formData.append("categories", JSON.stringify(form.categories));

      if (imageFile) {
        formData.append("item_image", imageFile);
      }

      await apiClient.post("/item", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/mypage/sell");
    } catch {
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
      <h2 className={`${styles.title} ${styles.centerTitle}`}>商品の出品</h2>

      <form onSubmit={submitItem} className={styles.form}>
        {/* 画像 */}
        <div className={styles.imageBoxWide}>
          <div className={styles.imageInner}>
            {previewUrl && <img src={previewUrl} className={styles.preview} />}

            <button
              type="button"
              className={styles.imageButton}
              onClick={() => fileInputRef.current?.click()}
            >
              画像を選択する
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </div>

        {/* カテゴリー */}
        <div className={styles.formGroup}>
          <label>カテゴリー（複数選択）</label>
          <div className={styles.categoryButtons}>
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat}
                type="button"
                className={
                  form.categories.includes(cat)
                    ? styles.categoryActive
                    : styles.categoryButton
                }
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 状態 */}
        <div className={styles.formGroup}>
          <label>商品の状態</label>
          <select
            value={form.condition}
            onChange={(e) =>
              setForm((v) => ({ ...v, condition: e.target.value }))
            }
            required
          >
            <option value="">選択してください</option>
            {CONDITION_LIST.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* ブランド */}
        <div className={styles.formGroup}>
          <label>ブランド（手動入力）</label>
          <input
            type="text"
            placeholder="例：Apple / SONY など."
            value={form.brand}
            onChange={(e) => setForm((v) => ({ ...v, brand: e.target.value }))}
          />
          <small className={styles.hint}>
            ※ 入力値は AI により正規化されます
          </small>
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
            placeholder="¥"
            value={form.price}
            onChange={(e) => setForm((v) => ({ ...v, price: e.target.value }))}
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
