import fs from 'node:fs';
import http from 'node:http';

const port = Number(process.env.MYBLOG_RUNTIME_SSE_PORT || 4121);
const runtimeIndexPath = process.env.MYBLOG_RUNTIME_INDEX_PATH || '/srv/myblog/site/runtime/content-index.json';
const clients = new Set();

let lastMtimeMs = 0;

const server = http.createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ ok: true, clients: clients.size, runtimeIndexPath }));
    return;
  }

  if (request.url !== '/runtime/events') {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('not found');
    return;
  }

  response.writeHead(200, {
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache, no-transform',
    connection: 'keep-alive',
    'x-accel-buffering': 'no'
  });
  response.write(': connected\n\n');

  clients.add(response);
  request.on('close', () => clients.delete(response));
});

server.listen(port, '127.0.0.1', () => {
  console.log(`[runtime-content-sse] Listening on 127.0.0.1:${port}`);
  console.log(`[runtime-content-sse] Watching ${runtimeIndexPath}`);
});

fs.watchFile(runtimeIndexPath, { interval: 1000 }, (current) => {
  if (!current.mtimeMs || current.mtimeMs === lastMtimeMs) return;
  lastMtimeMs = current.mtimeMs;
  emitContentIndex(current.mtime.toISOString());
});

setInterval(() => {
  for (const client of clients) client.write(': heartbeat\n\n');
}, 25000).unref();

function emitContentIndex(updatedAt) {
  const payload = JSON.stringify({ updatedAt });
  for (const client of clients) {
    client.write(`event: content-index\n`);
    client.write(`data: ${payload}\n\n`);
  }
  console.log(`[runtime-content-sse] content-index ${updatedAt} -> ${clients.size} client(s)`);
}
