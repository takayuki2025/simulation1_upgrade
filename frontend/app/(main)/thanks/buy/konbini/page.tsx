"use client";

import Link from "next/link";
import styles from "./W-ThanksKonbini.module.css";

export default function ThanksBuyKonbiniPage() {
  return (
    <div className={styles.thankYouPage}>
      <div className={styles.messageBox}>
        <h1 className={styles.title}>ご購入ありがとうございます！</h1>

        <p className={styles.message}>
          コンビニ払込用紙の処理方法はただいま勉強中です。
          <br />
          実装完了までしばらくお待ちください。
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.backHomeLink}>
            ホームへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
