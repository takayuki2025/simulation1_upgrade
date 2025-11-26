<?php
// ヘッダーと環境変数を出力
header('Content-Type: text/plain'); // 出力を見やすくする
echo "--- Environment Variables Check ---\n";
echo "HTTP_AUTHORIZATION: " . ($_SERVER['HTTP_AUTHORIZATION'] ?? 'Not Set') . "\n";
echo "AUTHORIZATION: " . ($_SERVER['AUTHORIZATION'] ?? 'Not Set') . "\n";

echo "\n--- All Headers Check ---\n";
if (function_exists('getallheaders')) {
    print_r(getallheaders());
} else {
    echo "getallheaders() function not available.\n";
    // 代替手段として $_SERVER からヘッダーを取得
    echo "Headers from $_SERVER:\n";
    foreach ($_SERVER as $key => $value) {
        if (substr($key, 0, 5) === 'HTTP_') {
            echo $key . ': ' . $value . "\n";
        }
    }
}

echo "\n--- Full $_SERVER Dump ---\n";
print_r($_SERVER);
?>
