const admin = require("firebase-admin");

// 💡 ダウンロードしたキーファイル名に合わせてください
const serviceAccount = require("./takayuki-2025-ver-1-786d018a3e17.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function deleteAllUsers() {
  console.log("認証ユーザーの取得を開始します...");

  let usersToDelete = [];
  let nextPageToken = undefined;

  // 全ユーザーの UID をリストアップ
  do {
    // 一度に最大1000件取得
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);

    // UIDを抽出してリストに追加
    listUsersResult.users.forEach((user) => {
      usersToDelete.push(user.uid);
    });

    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);

  if (usersToDelete.length === 0) {
    console.log("削除対象のユーザーはいません。処理を終了します。");
    return;
  }

  console.log(`\n合計 ${usersToDelete.length} 人のユーザーを削除します。`);

  // 全てのユーザーを一括削除
  const result = await admin.auth().deleteUsers(usersToDelete);

  console.log(`✅ 削除成功: ${result.successCount} 人`);
  if (result.failureCount > 0) {
    console.log(`⚠️ 削除失敗: ${result.failureCount} 人`);
    result.errors.forEach((err) => {
      console.error(`- 失敗したUID: ${err.uid}, エラー: ${err.error.message}`);
    });
  }
}

deleteAllUsers().catch((error) => {
  console.error("致命的なエラーが発生しました:", error);
});

// 実行方法 simulation1_upgradeで: node delete_users.js