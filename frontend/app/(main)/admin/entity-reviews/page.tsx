"use client";

import { useEffect, useState } from "react";

/**
 * ===== 型定義 =====
 */
type ItemEntity = {
  id: number;
  item_id: number;
  entity_type: string;
  raw_value: string;
  canonical_value: string;
  confidence: number;
  decision: "auto_accept" | "needs_review" | "rejected";
  extensions?: any;
  created_at: string;
};

type PageResp = {
  data: ItemEntity[];
  current_page: number;
  last_page: number;
};

/**
 * ===== 再解析理由 =====
 */
const REANALYZE_REASONS = [
  { value: "manual_reanalyze", label: "手動再解析" },
  { value: "policy_updated", label: "Policy 更新後" },
  { value: "assets_updated", label: "辞書更新後" },
  { value: "human_feedback", label: "人間レビュー反映" },
] as const;

type ReanalyzeReason = (typeof REANALYZE_REASONS)[number]["value"];

/**
 * ===== API =====
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://laravel.test:4430";

/**
 * ===== Page =====
 */
export default function EntityReviewsPage() {
  const [rows, setRows] = useState<ItemEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState<ReanalyzeReason>("manual_reanalyze");

  /**
   * 一覧取得
   */
  async function load() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/entity-reviews`, {
      credentials: "include",
    });
    const json: PageResp = await res.json();
    setRows(json.data ?? []);
    setLoading(false);
  }

  /**
   * approve / reject
   */
  async function act(id: number, action: "approve" | "reject") {
    await fetch(`${API_BASE}/api/entity-reviews/${id}/${action}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    await load();
  }

  /**
   * 再解析（reason 付き）
   */
  async function reanalyze(id: number, reason: ReanalyzeReason) {
    await fetch(`${API_BASE}/api/entity-reviews/${id}/reanalyze`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>
        Entity Reviews (needs_review)
      </h1>
      <p style={{ opacity: 0.8 }}>
        AtlasKernel が human review を要求したものを中心に表示します。
      </p>

      {/* 再解析 reason 選択 */}
      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>再解析理由:</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value as ReanalyzeReason)}
        >
          {REANALYZE_REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 16,
          }}
        >
          <thead>
            <tr>
              {[
                "ID",
                "Item",
                "Type",
                "Raw",
                "Canonical",
                "Conf",
                "Decision",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    padding: 10,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const isNeedsReview = row.decision === "needs_review";

              return (
                <tr
                  key={row.id}
                  style={{
                    opacity: isNeedsReview ? 1 : 0.4,
                    backgroundColor: isNeedsReview ? "transparent" : "#f7f7f7",
                  }}
                >
                  <td style={{ padding: 10 }}>{row.id}</td>
                  <td style={{ padding: 10 }}>{row.item_id}</td>
                  <td style={{ padding: 10 }}>{row.entity_type}</td>
                  <td style={{ padding: 10 }}>{row.raw_value}</td>
                  <td style={{ padding: 10 }}>{row.canonical_value}</td>
                  <td style={{ padding: 10 }}>{row.confidence.toFixed(3)}</td>
                  <td style={{ padding: 10 }}>{row.decision}</td>

                  <td style={{ padding: 10 }}>
                    {isNeedsReview && (
                      <>
                        <button
                          onClick={() => act(row.id, "approve")}
                          style={{ marginRight: 8 }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => act(row.id, "reject")}
                          style={{ marginRight: 8 }}
                        >
                          Reject
                        </button>
                        <button onClick={() => reanalyze(row.id, reason)}>
                          Reanalyze
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
