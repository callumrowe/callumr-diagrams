# JSON Canvas Viewer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Render `.canvas` diagrams in the existing read-only viewer using a library-backed renderer while keeping image diagrams unchanged.

**Architecture:** Add a dedicated `canvas-viewer` module that uses a lightweight graph rendering library to draw JSON Canvas text nodes and edges at authored coordinates. Update `app.js` to detect `.canvas` assets and route them through the new module, while reusing the same viewer controls and transform behavior used by image diagrams.

**Tech Stack:** Vanilla JS ESM, static `nginx` hosting, Node test runner (`node --test`), one frontend graph/rendering dependency.

---

### Task 1: Add failing tests for JSON Canvas path selection and model normalization

**Files:**
- Create: `tests/unit/canvas-viewer.test.js`
- Modify: `tests/unit/manifest-and-index.test.js`
- Reference: `app/app.js`

**Step 1: Write the failing test for extension detection helper**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { isCanvasFile } from "../../app/lib/canvas-viewer.js";

test("isCanvasFile detects .canvas paths case-insensitively", () => {
  assert.equal(isCanvasFile("/assets/diagram.canvas"), true);
  assert.equal(isCanvasFile("/assets/diagram.CANVAS"), true);
  assert.equal(isCanvasFile("/assets/diagram.png"), false);
});
```

**Step 2: Write the failing test for node and edge normalization**

```js
test("normalizeCanvasModel keeps text nodes and valid edges", () => {
  const model = normalizeCanvasModel({ nodes: [{ id: "a", type: "text", text: "A", x: 0, y: 0, width: 100, height: 40 }], edges: [] });
  assert.equal(model.nodes.length, 1);
  assert.equal(model.nodes[0].text, "A");
});
```

**Step 3: Run tests to verify failure**

Run: `node --test tests/unit/canvas-viewer.test.js`
Expected: FAIL with missing exports/functions.

**Step 4: Commit**

```bash
git add tests/unit/canvas-viewer.test.js tests/unit/manifest-and-index.test.js
git commit -m "test: add coverage for json canvas viewer path"
```

### Task 2: Implement JSON Canvas model parser and helpers

**Files:**
- Create: `app/lib/canvas-viewer.js`
- Modify: `tests/unit/canvas-viewer.test.js`

**Step 1: Write minimal implementation for parser helpers**

```js
export function isCanvasFile(file) {
  return String(file || "").toLowerCase().endsWith(".canvas");
}

export function normalizeCanvasModel(raw) {
  const nodes = Array.isArray(raw?.nodes) ? raw.nodes.filter((n) => n?.type === "text" && n?.id) : [];
  const nodeIds = new Set(nodes.map((n) => n.id));
  const edges = Array.isArray(raw?.edges)
    ? raw.edges.filter((e) => nodeIds.has(e?.fromNode) && nodeIds.has(e?.toNode))
    : [];
  return { nodes, edges };
}
```

**Step 2: Run unit tests to verify pass**

Run: `node --test tests/unit/canvas-viewer.test.js`
Expected: PASS.

**Step 3: Commit**

```bash
git add app/lib/canvas-viewer.js tests/unit/canvas-viewer.test.js
git commit -m "feat: add json canvas model normalization helpers"
```

### Task 3: Integrate library-backed renderer into diagram view path

**Files:**
- Modify: `app/app.js`
- Modify: `app/index.html`
- Modify: `app/styles.css`
- Modify: `app/data/diagrams.json`
- Reference: `app/assets/diagrams/Empowered teams vs managed teams.canvas`

**Step 1: Add frontend dependency wiring**

```html
<script type="importmap">
{
  "imports": {
    "<graph-lib>": "/lib/vendor/<graph-lib>.js"
  }
}
</script>
```

**Step 2: Add render entry point in `canvas-viewer.js`**

```js
export function renderCanvasDiagram({ container, model }) {
  // create renderer root
  // draw text nodes
  // draw edges with arrow markers
  // return { root, dispose }
}
```

**Step 3: Branch in `renderDiagram` for `.canvas`**

```js
if (isCanvasFile(item.file)) {
  const response = await fetch(buildFilePath(item.file, basePath), { cache: "no-store" });
  const raw = await response.json();
  const model = normalizeCanvasModel(raw);
  const rendered = renderCanvasDiagram({ container: canvas, model });
  // apply existing transform controls to rendered.root
}
```

**Step 4: Update manifest item to `.canvas` for this diagram**

```json
{
  "slug": "empowered-teams-v-managed-teams",
  "file": "/assets/diagrams/Empowered teams vs managed teams.canvas"
}
```

**Step 5: Run targeted tests**

Run: `node --test tests/unit/canvas-viewer.test.js tests/unit/manifest-and-index.test.js`
Expected: PASS.

**Step 6: Commit**

```bash
git add app/app.js app/index.html app/styles.css app/data/diagrams.json app/lib/canvas-viewer.js
git commit -m "feat: render json canvas diagrams in read-only viewer"
```

### Task 4: Verify regressions and fallback behavior

**Files:**
- Modify: `tests/smoke/manifest-assets-exist.test.js`
- Optional: `README.md`

**Step 1: Add smoke assertion that `.canvas` manifest assets exist and are parseable JSON**

```js
if (file.toLowerCase().endsWith(".canvas")) {
  assert.doesNotThrow(() => JSON.parse(readFileSync(`app/${rel}`, "utf8")));
}
```

**Step 2: Run full test suite**

Run: `node --test`
Expected: PASS.

**Step 3: Run local serve check**

Run: `npm run start:local`
Expected: container builds and serves app on `http://localhost:8080`.

**Step 4: Commit**

```bash
git add tests/smoke/manifest-assets-exist.test.js README.md
git commit -m "test: verify json canvas assets and viewer workflow"
```
