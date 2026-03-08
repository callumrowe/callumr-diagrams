import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("styles define semantic design tokens", () => {
  const css = readFileSync("app/styles.css", "utf8");
  assert.equal(css.includes("--background"), true);
  assert.equal(css.includes("--foreground"), true);
  assert.equal(css.includes("--primary"), true);
  assert.equal(css.includes("--radius"), true);
  assert.equal(css.includes(".viewer-head"), true);
});

test("styles preserve viewer interaction styling hooks", () => {
  const css = readFileSync("app/styles.css", "utf8");
  assert.equal(css.includes(".canvas"), true);
  assert.equal(css.includes("display: flex"), true);
  assert.equal(css.includes("max-width: 100%"), true);
  assert.equal(css.includes("max-height: 100%"), true);
});

test("styles avoid remote font stylesheets blocked by CSP", () => {
  const css = readFileSync("app/styles.css", "utf8");
  assert.equal(css.includes("fonts.googleapis.com"), false);
});
