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

test("viewer layout pins canvas to viewport without page-scroll drift", () => {
  const css = readFileSync("app/styles.css", "utf8");
  assert.equal(css.includes(".viewer-shell"), true);
  assert.equal(css.includes("height: 100vh"), true);
  assert.equal(css.includes("overflow: hidden"), true);
  assert.equal(/\.canvas\s*\{[\s\S]*min-height:\s*0;/.test(css), true);
  assert.equal(/\.diagram-canvas-host\s*\{[\s\S]*height:\s*100%;[\s\S]*min-height:\s*0;/.test(css), true);
});
