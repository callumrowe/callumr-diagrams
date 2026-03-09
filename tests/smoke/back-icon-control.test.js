import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("diagram back control uses arrow icon text with aria label", () => {
  const source = readFileSync("app/app.js", "utf8");
  assert.equal(source.includes('back.textContent = "←";'), true);
  assert.equal(source.includes('back.setAttribute("aria-label", "Back to index");'), true);
});
