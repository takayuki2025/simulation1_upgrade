import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    // Nuxtのコンポーネント、ページ、レイアウトなどすべてのVueファイルでTailwindクラスをスキャン
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 全体のフォントを 'Inter' に設定
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // カスタムカラーがあればここで定義
      },
    },
  },
  plugins: [],
};
