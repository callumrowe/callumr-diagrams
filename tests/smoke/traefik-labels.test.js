import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("compose includes host and pathprefix rule", () => {
  const yml = readFileSync("docker-compose.yml", "utf8");
  assert.equal(yml.includes("Host(`callums.work`)"), true);
  assert.equal(yml.includes("PathPrefix(`/diagrams`)"), true);
  assert.equal(yml.toLowerCase().includes("stripprefix"), true);
});
