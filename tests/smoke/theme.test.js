import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("styles define core CSS variables", () => {
  const css = readFileSync("app/styles.css", "utf8");
  assert.equal(css.includes("--bg"), true);
  assert.equal(css.includes("--fg"), true);
});
