/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ⚠ 修正点 1: Next.js 16でデフォルトとなったTurbopackとの競合を避けるため、
  // 従来の `webpack` 設定を削除します。
  // Docker環境でホットリロードの問題が再発した場合は、
  // Turbopack向けの新しいポーリング設定を検討する必要があります。
  // （多くの場合、Turbopackはより効率的でポーリングが不要になることもあります）

  // ★ 環境変数の設定は維持します
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  // ⚠ 修正点 2: `swcMinify: false` は Next.js 16では非推奨/無効なオプションとなったため削除します。
  // SWCによるミニファイはデフォルトで有効になっています。
};

export default nextConfig;
