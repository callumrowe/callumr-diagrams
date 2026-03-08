import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("repo provides docker local serve config and script", () => {
  const localCompose = readFileSync("docker-compose.local.yml", "utf8");
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));

  assert.equal(localCompose.includes("ports:"), true);
  assert.equal(localCompose.includes('"8080:80"'), true);
  assert.equal(pkg.scripts["start:local"].includes("docker-compose.local.yml"), true);
});
