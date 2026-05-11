# Diagrams App

Minimal, read-only diagram gallery for `https://diagrams.callums.work/diagrams`.

## Visual language

The app styling uses semantic tokens in `app/styles.css` (for example `--background`, `--foreground`, `--primary`, `--border`, and `--radius`) and loads Inter + Space Grotesk to align with the style direction used in `callum-rowe-lab`.

This pass is visual only. Theme toggling and dark-mode behavior are intentionally out of scope.

## Local run

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
5. Deploy:

```bash
npm run deploy
```

## Hosting

Deployed on Hetzner (`root@62.238.0.56`) at `/opt/diagram-app`. The platform Caddy reverse proxy routes `diagrams.callums.work` → `diagram-app:80`. Nginx handles `/diagrams` base-path routing and rewrites.

## Verification

```bash
node --test
docker compose config
```
