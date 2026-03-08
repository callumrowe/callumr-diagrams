import test from "node:test";
import assert from "node:assert/strict";
import { isCanvasFile, normalizeCanvasModel } from "../../app/lib/canvas-viewer.js";

test("isCanvasFile detects .canvas paths case-insensitively", () => {
  assert.equal(isCanvasFile("/assets/diagram.canvas"), true);
  assert.equal(isCanvasFile("/assets/diagram.CANVAS"), true);
  assert.equal(isCanvasFile("/assets/diagram.png"), false);
});

test("normalizeCanvasModel keeps text nodes and valid edges", () => {
  const model = normalizeCanvasModel({
    nodes: [
      { id: "a", type: "text", text: "A", x: 0, y: 0, width: 100, height: 40 },
      { id: "b", type: "file", x: 10, y: 10, width: 40, height: 40 },
    ],
    edges: [
      { id: "e1", fromNode: "a", toNode: "a", fromSide: "bottom", toSide: "top" },
      { id: "e2", fromNode: "a", toNode: "missing", fromSide: "right", toSide: "left" },
    ],
  });

  assert.equal(model.nodes.length, 1);
  assert.equal(model.nodes[0].id, "a");
  assert.equal(model.edges.length, 1);
  assert.equal(model.edges[0].id, "e1");
});
