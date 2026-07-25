/**
 * Servidor estatico minimo para probar el sitio en local.
 * Uso: node tools/dev-server.mjs [carpeta] [puerto]
 * Por defecto sirve la raiz del repo en el puerto 5190.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
);
const PORT = Number(process.argv[3] || 5190);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const filePath = path.join(ROOT, urlPath === "/" ? "/index.html" : urlPath);

    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.stat(filePath, (statErr, stats) => {
      if (statErr || !stats.isFile()) {
        res.writeHead(404);
        res.end("Not found: " + urlPath);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    });
  })
  .listen(PORT, () => console.log(`Dev server: http://localhost:${PORT}`));
