# JSON Canvas Viewer Design

## Goal

Add a read-only JSON Canvas viewer so `.canvas` assets render directly in the existing diagram routes, using a library-backed renderer for text nodes and edges.

## Scope

- Support `text` nodes.
- Support connector edges between node sides.
- Keep the viewer read-only.
- Preserve the current image viewer flow for non-`.canvas` files.

## Architecture

- Keep the current static frontend and route model unchanged.
- Add a new library-backed renderer module for `.canvas` files.
- Detect file type in `app.js` and branch to image or JSON Canvas render path.
- Keep pan, zoom, reset, and keyboard controls consistent across both paths.

## Rendering Model

- Parse `.canvas` JSON into a normalized view model.
- Render node cards at authored coordinates with authored width and height.
- Render edges using side anchors (`top`, `bottom`, `left`, `right`).
- Render arrowheads when `fromEnd` indicates arrow style.

## Error Handling

- If fetch or parse fails, show an in-viewer notice and keep navigation functional.
- Ignore unsupported fields without crashing.
- Do not break index routes on diagram render failures.

## Verification

- Unit tests for format detection and JSON Canvas normalization.
- Manual check for `.png` and `.canvas` rendering parity in controls.
- Manual check for graceful fallback on invalid `.canvas` content.
