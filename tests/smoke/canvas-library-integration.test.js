import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("app wires json-canvas-viewer for .canvas diagrams", () => {
  const appJs = readFileSync("app/app.js", "utf8");
  assert.equal(appJs.includes('from "json-canvas-viewer"'), true);
  assert.equal(appJs.includes("new JSONCanvasViewer("), true);
  assert.equal(appJs.includes("await fetchCanvas("), true);
});
