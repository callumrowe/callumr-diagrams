import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("compose includes diagrams subdomain router rule", () => {
  const yml = readFileSync("docker-compose.yml", "utf8");
  assert.equal(yml.includes("Host(`diagrams.callums.work`)"), true);
  assert.equal(yml.includes("traefik.http.routers.diagram-app.rule"), true);
});
