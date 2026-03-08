import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

test("required app files exist", () => {
  assert.equal(existsSync("app/index.html"), true);
  assert.equal(existsSync("app/styles.css"), true);
  assert.equal(existsSync("app/app.js"), true);
  assert.equal(existsSync("app/data/diagrams.json"), true);
});
