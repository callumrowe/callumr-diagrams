import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("nginx config includes SPA fallback", () => {
  const conf = readFileSync("nginx/default.conf", "utf8");
  assert.equal(conf.includes("try_files $uri /index.html"), true);
  assert.equal(conf.includes("location /diagrams/"), true);
  assert.equal(conf.includes("rewrite ^/diagrams/(.*)$ /$1"), true);
});
