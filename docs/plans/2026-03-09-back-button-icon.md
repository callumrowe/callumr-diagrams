# Back Button Icon Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the diagram viewer back link text with an icon while preserving navigation and accessibility.

**Architecture:** Keep the existing anchor-based back control in `renderDiagram` and only change its rendered label to a left-arrow glyph. Preserve current routing behavior and base-path compatibility, then enforce the expected markup contract with a focused smoke test that inspects `app/app.js`.

**Tech Stack:** Vanilla JavaScript ES modules, Node test runner (`node:test`), static file smoke tests.

---

### Task 1: Add a smoke guard for icon-only back control

**Files:**
- Create: `tests/smoke/back-icon-control.test.js`
- Test: `tests/smoke/back-icon-control.test.js`

**Step 1: Write the failing test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("diagram back control uses arrow icon text with aria label", () => {
  const source = readFileSync("app/app.js", "utf8");
  assert.equal(source.includes('back.textContent = "←";'), true);
  assert.equal(source.includes('back.setAttribute("aria-label", "Back to index");'), true);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/smoke/back-icon-control.test.js`
Expected: FAIL because icon text and ARIA label are not yet in `app/app.js`.

**Step 3: Commit**

```bash
git add tests/smoke/back-icon-control.test.js
git commit -m "test: assert icon-only back control contract"
```

### Task 2: Implement icon-only back link behavior

**Files:**
- Modify: `app/app.js`
- Test: `tests/smoke/back-icon-control.test.js`

**Step 1: Write minimal implementation**

```js
back.textContent = "←";
back.setAttribute("aria-label", "Back to index");
```

**Step 2: Run targeted test to verify it passes**

Run: `node --test tests/smoke/back-icon-control.test.js`
Expected: PASS.

**Step 3: Run full suite**

Run: `npm test`
Expected: PASS across all unit and smoke tests.

**Step 4: Commit**

```bash
git add app/app.js tests/smoke/back-icon-control.test.js
git commit -m "feat: switch viewer back control to icon with aria label"
```
