# Diagrams App

Minimal, read-only diagram gallery for `https://callums.work/diagrams`.

## Local run

```bash
docker compose up --build
```

If Traefik is not running locally, open `http://localhost` only when directly publishing the container port in a temporary local compose override.

## Publish a new diagram

1. Export a high-resolution PNG or SVG.
2. Copy it into `app/assets/diagrams/`.
3. Add a new object in `app/data/diagrams.json`:

```json
{
  "slug": "diagram-slug",
  "title": "Diagram Title",
  "file": "/assets/diagrams/diagram-file.svg",
  "width": 2400,
  "height": 1350
}
```

4. Commit and push changes.
5. Redeploy on the droplet:

```bash
docker compose pull
docker compose up -d --build
```

## Traefik route

- Router rule: `Host(callums.work) && PathPrefix(/diagrams)`
- Middleware: strip `/diagrams`
- App handles index (`/`) and diagram routes (`/<slug>`) after prefix stripping.

## Verification

```bash
node --test
docker compose config
```
