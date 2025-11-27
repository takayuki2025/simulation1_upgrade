# ----------------------------------------------------------------------
# 開発/実行ステージ
# ----------------------------------------------------------------------
# ベースイメージを node:22-bullseye (Debian系) に合わせます
FROM node:22-bullseye

# ビルドツールをインストール (bullseyeはDebian系のため、apk ではなく apt を使用)
# build-base の代わりに build-essential を使用
RUN apt-get update && \
    apt-get install -y build-essential python3 && \
    rm -rf /var/lib/apt/lists/*

# ワーキングディレクトリを設定
WORKDIR /app

# 1. package.jsonとロックファイルをコンテナ内にコピー
# ★ 修正: ロックファイルもコピーし、npm installのキャッシュを最大限に活用
COPY package.json ./
COPY package-lock.json ./


# 2. 依存関係をクリーンインストール
#RUN rm -rf node_modules && \ <- 初回ビルド時はnode_modulesがないため rm は不要
#    npm install
RUN npm install


# 3. 開発用の実行環境として使用
# `npm run dev` コマンドを正確に実行し、`npm`にパス解決を任せる
CMD [ "npm", "run", "dev" ]