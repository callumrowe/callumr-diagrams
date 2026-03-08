import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("app wiring supports .canvas rendering", () => {
  const appJs = readFileSync("app/app.js", "utf8");
  assert.equal(appJs.includes('from "/lib/vendor/json-canvas-viewer.chimp.js"'), true);
  assert.equal(appJs.includes("isCanvasFile(item.file)"), true);
  assert.equal(appJs.includes("new JSONCanvasViewer("), true);
  assert.equal(appJs.includes("await renderDiagram(found)"), true);
});
