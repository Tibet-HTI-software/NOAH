import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = 5510;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".json": "application/json",
};

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const file = normalize(join(root, p));
    if (!file.startsWith(root)) { res.writeHead(403).end("403"); return; }
    const data = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" }).end("<h1>404</h1>");
  }
}).listen(port, () => console.log(`NOAH dev server: http://localhost:${port}`));
