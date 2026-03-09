import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("index loads CSS and JS through /diagrams base path", () => {
  const html = readFileSync("app/index.html", "utf8");
  assert.equal(html.includes('href="/diagrams/styles.css?v='), true);
  assert.equal(html.includes('src="/diagrams/app.js?v='), true);
});
