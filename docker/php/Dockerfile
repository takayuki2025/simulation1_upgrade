FROM php:8.4-fpm

# 必要なシステムパッケージとPHP拡張機能をインストール
# SPA構成のため、Node.js関連のインストールは削除されました。
RUN apt update \
  # 必要なライブラリと開発ツールをインストール
  && apt install -y git default-mysql-client zlib1g-dev libzip-dev libpng-dev libjpeg-dev libwebp-dev unzip \
  # 依存関係のないパッケージのキャッシュをクリア
  && rm -rf /var/lib/apt/lists/* \
  && docker-php-ext-configure gd --with-jpeg --with-webp \
  && docker-php-ext-install -j$(nproc) gd pdo_mysql zip bcmath 

# Composerのインストール
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# ★★★ 修正箇所: FPM設定ファイルをコピーして、9000ポートでTCPリッスンさせる ★★★
# 競合を避けるため、zz-fpm-listen.conf のコピーを削除し、www.conf を上書きします。
# COPY ./conf.d/zz-fpm-listen.conf /usr/local/etc/php-fpm.d/zz-fpm-listen.conf  <-- この行を削除/コメントアウト
COPY ./conf.d/mailhog.ini /usr/local/etc/php/conf.d/mailhog.ini
# ----------------------------------------------------------------------------

# ワークディレクトリの設定
WORKDIR /var/www

# コメントアウトされた COPY行の下に、新しい設定ファイルの上書きを追加します。
# ----------------------------------------------------------------------------
# 【新しい修正】競合のないシンプルな設定で www.conf を上書きします
COPY ./conf.d/php-fpm-www.conf /usr/local/etc/php-fpm.d/www.conf
# ----------------------------------------------------------------------------
