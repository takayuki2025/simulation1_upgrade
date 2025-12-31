"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/ui/auth/useAuth";
import styles from "./W-Item-Sell.module.css";

type SellForm = {
  name: string;
  price: string;
  explain: string;
  attributes: string;
  categories: string[];
};

type ItemOrigin = "USER_PERSONAL" | "SHOP_MANAGED";

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

export default function ItemSellPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, apiClient, user } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<SellForm>({
    name: "",
    price: "",
    explain: "",
    attributes: "",
    categories: [],
  });

  const [itemOrigin, setItemOrigin] = useState<ItemOrigin>("USER_PERSONAL");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isLoading && !isAuthenticated) {
    router.replace("/login");
    return null;
  }

  if (!user) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const toggleCategory = (category: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const submitItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiClient || !user) {
      setError("ログイン状態が確認できません");
      return;
    }

    if (!imageFile) {
      setError("画像を選択してください");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 1. Draft
      const draftRes = await apiClient.post("/items/drafts", {
        seller_id:
          itemOrigin === "USER_PERSONAL"
            ? `individual:${user.id}`
            : `shop:managed`,
        name: form.name,
        price_amount: Number(form.price),
        price_currency: "JPY",
        brand: form.attributes || null,
        explain: form.explain || null,
        category: form.categories.length ? form.categories : null,
      });

      const draftId: string = draftRes.data.draft_id;

      // 2. Image
      const imageData = new FormData();
      imageData.append("image", imageFile);

      await apiClient.post(`/items/drafts/${draftId}/image`, imageData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("DEBUG publish payload", {
        item_origin: itemOrigin,
        shop_id: itemOrigin === "SHOP_MANAGED" ? (user as any).shop_id : null,
        user,
      });

      // 3. Publish
      await apiClient.post(`/items/drafts/${draftId}/publish`, {
        item_origin: itemOrigin,
        // shop_id: itemOrigin === "SHOP_MANAGED" ? (user.shop_id ?? null) : null,
        shop_id: itemOrigin === "SHOP_MANAGED" ? 2 : null,
      });

      router.push("/");
    } catch {
      setError("商品の出品に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={`${styles.title} ${styles.centerTitle}`}>商品の出品</h2>

      <form onSubmit={submitItem} className={styles.form}>
        {/* 出品名義 */}
        <div className={styles.formGroup}>
          <label>出品名義</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                checked={itemOrigin === "USER_PERSONAL"}
                onChange={() => setItemOrigin("USER_PERSONAL")}
              />
              個人出品
            </label>

            <label>
              <input
                type="radio"
                checked={itemOrigin === "SHOP_MANAGED"}
                onChange={() => setItemOrigin("SHOP_MANAGED")}
              />
              ショップ管理商品（準備中）
            </label>
          </div>
        </div>

        {/* =========================
            画像
        ========================= */}
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

        {/* =========================
            カテゴリー
        ========================= */}
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

        {/* brand / condition / color */}
        <div className={styles.formGroup}>
          <label>ブランド・状態・色（まとめて入力）</label>
          <input
            type="text"
            placeholder="例：Apple ほぼ新品 黒"
            value={form.attributes}
            onChange={(e) =>
              setForm((v) => ({ ...v, attributes: e.target.value }))
            }
          />
          <small className={styles.hint}>
            ※ 入力内容は自動で解析・正規化されます
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

        {/* 商品説明 */}
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
