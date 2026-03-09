import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("app wires json-canvas-viewer for .canvas diagrams", () => {
  const appJs = readFileSync("app/app.js", "utf8");
  assert.equal(appJs.includes('from "/lib/vendor/json-canvas-viewer.chimp.js"'), true);
  assert.equal(appJs.includes("new JSONCanvasViewer("), true);
  assert.equal(appJs.includes("await fetch(buildFilePath(item.file, basePath)"), true);
  const renderStart = appJs.indexOf("async function renderDiagram");
  const renderEnd = appJs.indexOf("function renderNotFound");
  const renderBody = appJs.slice(renderStart, renderEnd);
  assert.equal(renderBody.indexOf("app.replaceChildren(shell);") < renderBody.indexOf("new JSONCanvasViewer("), true);
});
