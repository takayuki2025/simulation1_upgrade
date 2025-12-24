"use client";

import Link from "next/link";
import styles from "./W-StripeThankYou.module.css";

export default function StripeThankYouPage() {
  return (
    <div className={styles.thankYouPage}>
      <div className={styles.messageBox}>
        <h1 className={styles.title}>ご購入ありがとうございます！</h1>

        <p className={styles.message}>
          Stripe カード決済が正常に完了しました。
          <br />
          商品発送完了までしばらくお待ちください。
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
