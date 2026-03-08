# Diagrams Gallery Design

## Goal

Build a lightweight, read-only web app at `https://callums.work/diagrams` that lists published diagrams and opens each diagram on a dedicated high-resolution viewer page.

## Product Direction

- Audience: public readers.
- Publishing workflow: Git-based deploy.
- Index detail: title-only list.
- Diagram authoring: static exported image files.
- UX style: minimalist, clean, nerdy.

## Architecture

- Static frontend served by `nginx` in Docker.
- No backend API, auth, or database in v1.
- Diagram metadata in `diagrams.json`.
- Diagram assets in local static directory.
- Traefik routes `Host(callums.work)` + `PathPrefix(/diagrams)` and strips prefix before forwarding to the app container.

## Routing

- `/diagrams` renders the index page.
- `/diagrams/<slug>` renders a single diagram viewer page.
- Client-side router parses the path after Traefik strip-prefix forwarding.

## Content Model

Each diagram entry contains:

- `slug`: URL-safe identifier.
- `title`: display title.
- `file`: relative image file path.
- optional `width` and `height` for initial layout stability.

No tags, date, or summaries in v1.

## Viewer UX

- Full-viewport image area.
- Fit-to-screen initial render.
- Zoom and pan interactions.
- Keyboard controls: `+`, `-`, `0`, arrow keys, `Esc`.
- Sparse controls: title, back action, zoom controls.

## Deployment

- Single app container (`nginx:alpine`) on shared Docker network with Traefik.
- TLS handled by Traefik.
- Asset caching headers for diagram files.
- Basic security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy`).

## Publish Workflow

1. Export diagram as high-resolution PNG/SVG.
2. Add file under `app/assets/diagrams/`.
3. Add entry to `app/data/diagrams.json`.
4. Commit and push.
5. Redeploy container on droplet.
