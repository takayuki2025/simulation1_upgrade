import { createServer } from "https";
import { parse } from "url";
import next from "next";
import fs from "fs"; // fsはNode.jsの組み込みモジュール

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// ★★★ ここは以前mkcertで作成されたファイル名に合わせてください ★★★
const httpsOptions = {
  // 例: mkcert localhost laravel.test で作成されたファイル名
    key: fs.readFileSync("./ssl_certs/localhost+3-key.pem"),
    cert: fs.readFileSync("./ssl_certs/localhost+3.pem"),
};

app
    .prepare()
    .then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on https://localhost:${port}`);
    });
    })
    .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
    });
