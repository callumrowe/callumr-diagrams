import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("README documents add-diagram workflow", () => {
  const md = readFileSync("README.md", "utf8");
  assert.equal(md.includes("app/assets/diagrams/"), true);
  assert.equal(md.includes("app/data/diagrams.json"), true);
});
