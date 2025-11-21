# --- 開発/実行ステージ ---
FROM node:22-bullseye

# ビルドツールをインストール (ネイティブモジュールが必要な場合に備えて)
RUN apt-get update && apt-get install -y build-essential python3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# パッケージファイルをコピー
# Nuxtプロジェクトがコンテキストルートの 'frontend' ディレクトリにあると仮定
COPY frontend/package*.json ./

# 依存関係のインストール
RUN npm cache clean --force && \
    rm -f package-lock.json && \
    npm install --legacy-peer-deps

# ソースコードはボリュームマウントされるため、ここではコピーしません。

# 開発用の実行環境として使用
CMD [ "yarn", "dev", "--host", "0.0.0.0" ]
