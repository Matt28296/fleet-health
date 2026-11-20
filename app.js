// Tiny fleet health / webhook receiver. No dependencies.
const http = require("http");

const startedAt = Date.now();
const port = process.env.PORT || 3001;

function json(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { "content-type": "application/json", "content-length": Buffer.byteLength(body) });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
    return json(res, 200, { status: "ok", service: "fleet-health", uptime_seconds: Math.floor((Date.now() - startedAt) / 1000) });
  }
  if (req.method === "POST" && req.url === "/webhook") {
    let size = 0;
    req.on("data", (chunk) => { size += chunk.length; });
    req.on("end", () => json(res, 200, { received: true, bytes: size }));
    return;
  }
  return json(res, 404, { status: "not_found" });
});

server.listen(port, () => console.log(`fleet-health listening on port ${port}`));
