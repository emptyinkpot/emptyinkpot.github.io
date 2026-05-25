import http from "node:http";
import { readPublishState, runPublishAction } from "./publish-runtime-lib.mjs";

const port = Number(process.env.MYBLOG_PUBLISH_API_PORT || 4122);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
    if (req.method === "GET" && url.pathname === "/health") {
      return sendJson(res, 200, { ok: true, service: "myblog-publish-api" });
    }
    if (req.method === "GET" && url.pathname === "/status") {
      return sendJson(res, 200, readPublishState());
    }
    if (req.method === "POST" && ["/release", "/build", "/rollback"].includes(url.pathname)) {
      const body = await readJson(req);
      const action = url.pathname.slice(1);
      const result = await runPublishAction(action, body);
      return sendJson(res, result.ok ? 200 : 500, result);
    }
    return sendJson(res, 404, { ok: false, error: "route not found" });
  } catch (error) {
    return sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`[myblog-publish-api] listening on 127.0.0.1:${port}`);
});

function sendJson(res, status, payload) {
  const body = `${JSON.stringify(payload)}\n`;
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}
