module.exports = {
  // 1. インデント設定
  tabWidth: 2, // インデント幅をスペース2に設定（Next.js/Reactで一般的）
  useTabs: false, // タブではなくスペースを使用

  // 2. 行末の設定
  semi: true, // 文末にセミコロンを付ける（TypeScriptで推奨）
  printWidth: 80, // 最大行長を80文字に設定（可読性重視）
  endOfLine: "lf", // 行末の改行コードをLF（Linux/macOS標準）に統一

  // 3. クォート設定
  singleQuote: false, // 文字列にはダブルクォート " " を使用

  // 4. カンマ設定
  trailingComma: "all", // オブジェクトや配列の末尾にコンマを付ける

  // 5. その他
  arrowParens: "always", // アロー関数の引数は常にカッコ () で囲む
};
