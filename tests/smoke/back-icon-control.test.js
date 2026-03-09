import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("diagram back control uses JCV chevron button styling", () => {
  const source = readFileSync("app/app.js", "utf8");
  assert.equal(source.includes('const back = document.createElement("button");'), true);
  assert.equal(source.includes('back.type = "button";'), true);
  assert.equal(source.includes('back.className = "viewer-back";'), true);
  assert.equal(source.includes('back.innerHTML ='), true);
  assert.equal(source.includes("viewBox=\"-3.6 -3.6 31.2 31.2\""), true);
  assert.equal(source.includes('back.setAttribute("aria-label", "Back to index");'), true);
});
