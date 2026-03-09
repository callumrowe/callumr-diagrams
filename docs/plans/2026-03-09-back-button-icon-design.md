# Back Button Icon Design

## Goal

Replace the current text-based back control (`<- back`) in the diagram viewer header with a left-arrow icon while preserving existing navigation behavior and accessibility.

## Current State

- File: `app/app.js`
- The viewer header creates an anchor for back navigation.
- The control currently renders as plain text (`<- back`).
- Click behavior routes to index via existing `navigate(basePath || "/")` logic.

## Approaches Considered

1. Text glyph only (`←`) with ARIA label (recommended)
   - Pros: minimal code change, no extra CSS or assets, keeps current link semantics.
   - Cons: appearance depends on font rendering.

2. Inline SVG chevron icon
   - Pros: consistent visual shape and precise styling control.
   - Cons: extra DOM markup and styling complexity for a small change.

3. CSS pseudo-element icon
   - Pros: cleaner JS markup with icon handled in CSS.
   - Cons: stronger coupling between structure and styles; less explicit in JS.

## Selected Design

Use a single-character left-arrow icon (`←`) as the visible control.

Implementation details:

- In `renderDiagram` back-link creation:
  - Replace `back.textContent = "<- back"` with `back.textContent = "←"`.
  - Add `back.setAttribute("aria-label", "Back to index")`.
- Keep `href` and click handler unchanged.
- Do not modify route logic, key bindings, or base-path handling.

## Accessibility

- The control remains an anchor, preserving keyboard and semantic behavior.
- `aria-label` ensures screen readers announce intent despite icon-only visible text.

## Testing Plan

- Run targeted unit tests for routing/path behavior:
  - `node --test tests/unit/router.test.js`
  - `node --test tests/unit/paths.test.js`
- Run full suite:
  - `npm test`

## Risks and Mitigations

- Risk: icon-only link may be less obvious visually.
  - Mitigation: keep established link color and placement in header; retain Escape key back behavior.
