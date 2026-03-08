# Diagrams App

Minimal, read-only diagram gallery for `https://callums.work/diagrams`.

## Visual language

The app styling uses semantic tokens in `app/styles.css` (for example `--background`, `--foreground`, `--primary`, `--border`, and `--radius`) and loads Inter + Space Grotesk to align with the style direction used in `callum-rowe-lab`.

This pass is visual only. Theme toggling and dark-mode behavior are intentionally out of scope.

## Local run

```bash
docker compose up --build
```

If Traefik is not running locally, open `http://localhost` only when directly publishing the container port in a temporary local compose override.

## Local run without Traefik

Use the local compose file that binds nginx directly to port 8080:

```bash
npm run start:local
```

Then open `http://localhost:8080`.

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
