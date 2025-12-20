(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/(main)/sell/W-Item-Sell.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "W-Item-Sell-module__E2Da0W__actions",
  "categoryActive": "W-Item-Sell-module__E2Da0W__categoryActive",
  "categoryButton": "W-Item-Sell-module__E2Da0W__categoryButton",
  "categoryButtons": "W-Item-Sell-module__E2Da0W__categoryButtons",
  "centerTitle": "W-Item-Sell-module__E2Da0W__centerTitle",
  "error": "W-Item-Sell-module__E2Da0W__error",
  "form": "W-Item-Sell-module__E2Da0W__form",
  "formGroup": "W-Item-Sell-module__E2Da0W__formGroup",
  "hint": "W-Item-Sell-module__E2Da0W__hint",
  "imageBox": "W-Item-Sell-module__E2Da0W__imageBox",
  "imageBoxWide": "W-Item-Sell-module__E2Da0W__imageBoxWide",
  "imageButton": "W-Item-Sell-module__E2Da0W__imageButton",
  "imageInner": "W-Item-Sell-module__E2Da0W__imageInner",
  "imagePlaceholder": "W-Item-Sell-module__E2Da0W__imagePlaceholder",
  "preview": "W-Item-Sell-module__E2Da0W__preview",
  "title": "W-Item-Sell-module__E2Da0W__title",
  "wrapper": "W-Item-Sell-module__E2Da0W__wrapper",
});
}),
"[project]/app/(main)/sell/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ItemSellPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ui/auth/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/(main)/sell/W-Item-Sell.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
/* =========================
   定数
========================= */ const CATEGORY_LIST = [
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
    "アクセサリー"
];
function ItemSellPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isAuthenticated, isLoading, apiClient } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        price: "",
        explain: "",
        attributes: "",
        categories: []
    });
    const [imageFile, setImageFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewUrl, setPreviewUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    /* =========================
     Guard
  ========================= */ if (!isLoading && !isAuthenticated) {
        router.replace("/login");
        return null;
    }
    /* =========================
     Image Select
  ========================= */ const handleImageChange = (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };
    /* =========================
     Category Toggle
  ========================= */ const toggleCategory = (category)=>{
        setForm((prev)=>({
                ...prev,
                categories: prev.categories.includes(category) ? prev.categories.filter((c)=>c !== category) : [
                    ...prev.categories,
                    category
                ]
            }));
    };
    /* =========================
     Submit（DDD 正式フロー）
     1. Draft 作成
     2. Image Upload
     3. Publish
  ========================= */ const submitItem = async (e)=>{
        e.preventDefault();
        if (!apiClient || !imageFile) {
            setError("画像を選択してください");
            return;
        }
        setIsSubmitting(true);
        setError("");
        try {
            /* =========================
         1. Draft 作成
         ※ attributes を brand として送信
      ========================= */ const draftRes = await apiClient.post("/items/drafts", {
                seller_id: "individual:2",
                name: form.name,
                price_amount: Number(form.price),
                price_currency: "JPY",
                // ★ AtlasKernel 解析対象
                brand: form.attributes || null,
                explain: form.explain || null,
                category: form.categories.length ? form.categories : null
            });
            const draftId = draftRes.data.draft_id;
            /* =========================
         2. Image Upload
      ========================= */ const imageData = new FormData();
            imageData.append("image", imageFile);
            await apiClient.post(`/items/drafts/${draftId}/image`, imageData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            /* =========================
         3. Publish
      ========================= */ await apiClient.post(`/items/drafts/${draftId}/publish`);
            router.push("/"); // or /mypage/sell
        } catch (e) {
            setError("商品の出品に失敗しました");
        } finally{
            setIsSubmitting(false);
        }
    };
    /* =========================
     UI
  ========================= */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wrapper,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].centerTitle}`,
                children: "商品の出品"
            }, void 0, false, {
                fileName: "[project]/app/(main)/sell/page.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: submitItem,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].form,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageBoxWide,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageInner,
                                children: [
                                    previewUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: previewUrl,
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].preview
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/sell/page.tsx",
                                        lineNumber: 159,
                                        columnNumber: 28
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageButton,
                                        onClick: ()=>fileInputRef.current?.click(),
                                        children: "画像を選択する"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(main)/sell/page.tsx",
                                        lineNumber: 161,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: fileInputRef,
                                type: "file",
                                accept: "image/*",
                                hidden: true,
                                onChange: handleImageChange
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/sell/page.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].formGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "カテゴリー（複数選択）"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryButtons,
                                children: CATEGORY_LIST.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: form.categories.includes(cat) ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryActive : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryButton,
                                        onClick: ()=>toggleCategory(cat),
                                        children: cat
                                    }, cat, false, {
                                        fileName: "[project]/app/(main)/sell/page.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/sell/page.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].formGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "ブランド・状態・色（まとめて入力可能でどのような複雑なデーターでも処理できる開発をしています。）"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "例：Apple ほぼ新品 黒（スペース、コンマなど有無でも可能）",
                                value: form.attributes,
                                onChange: (e)=>setForm((v)=>({
                                            ...v,
                                            attributes: e.target.value
                                        }))
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hint,
                                children: "※ 入力内容は自動で解析・正規化されます ※企業判断や成長企画や実績に未来再利用可能な形で蓄積するエンジン開発のプロトタイプです。"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/sell/page.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].formGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "商品名"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: form.name,
                                onChange: (e)=>setForm((v)=>({
                                            ...v,
                                            name: e.target.value
                                        })),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 220,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/sell/page.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].formGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "商品説明"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                rows: 6,
                                value: form.explain,
                                onChange: (e)=>setForm((v)=>({
                                            ...v,
                                            explain: e.target.value
                                        }))
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 231,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/sell/page.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].formGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: "価格"
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                placeholder: "¥",
                                value: form.price,
                                onChange: (e)=>setForm((v)=>({
                                            ...v,
                                            price: e.target.value
                                        })),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/app/(main)/sell/page.tsx",
                                lineNumber: 243,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(main)/sell/page.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].error,
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/sell/page.tsx",
                        lineNumber: 251,
                        columnNumber: 19
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$main$292f$sell$2f$W$2d$Item$2d$Sell$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].actions,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: isSubmitting,
                            children: "出品する"
                        }, void 0, false, {
                            fileName: "[project]/app/(main)/sell/page.tsx",
                            lineNumber: 254,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(main)/sell/page.tsx",
                        lineNumber: 253,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(main)/sell/page.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(main)/sell/page.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
_s(ItemSellPage, "bkGucr8Grv3MQ+eNgyJgy+bg6Zs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ui$2f$auth$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = ItemSellPage;
var _c;
__turbopack_context__.k.register(_c, "ItemSellPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_%28main%29_sell_3e7954aa._.js.map