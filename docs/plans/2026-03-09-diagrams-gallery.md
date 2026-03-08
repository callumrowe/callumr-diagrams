# Diagrams Gallery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a lightweight read-only diagram gallery at `https://callums.work/diagrams` with a title-only index and high-resolution diagram viewer pages.

**Architecture:** Serve a static frontend (`index.html`, `styles.css`, `app.js`, JSON manifest, image assets) from `nginx` in Docker. Use Traefik with host/path-prefix routing and strip-prefix middleware. Handle index/detail routing on the client.

**Tech Stack:** Vanilla JS, static JSON data, Node test runner (`node --test`), nginx, Docker, docker-compose, Traefik labels.

---

### Task 1: Scaffold base app

**Files:**
- Create: `app/index.html`
- Create: `app/styles.css`
- Create: `app/app.js`
- Create: `app/data/diagrams.json`
- Create: `app/assets/diagrams/.gitkeep`
- Modify: `package.json`

### Task 2: Manifest and index rendering

**Files:**
- Create: `app/lib/manifest.js`
- Modify: `app/app.js`
- Modify: `app/index.html`
- Modify: `app/data/diagrams.json`

### Task 3: Client routing + diagram viewer

**Files:**
- Create: `app/lib/router.js`
- Modify: `app/app.js`
- Modify: `app/styles.css`

### Task 4: Visual system polish

**Files:**
- Modify: `app/styles.css`
- Modify: `app/index.html`

### Task 5: Containerization

**Files:**
- Create: `Dockerfile`
- Create: `nginx/default.conf`
- Create: `.dockerignore`

### Task 6: Traefik integration

**Files:**
- Create: `docker-compose.yml`
- Create/Modify: `README.md`

### Task 7: Verification and docs

**Files:**
- Modify: `README.md`
- Create: `tests/smoke/*.test.js`
- Create: `tests/unit/*.test.js`

## Verification

- `node --test`
- `docker compose config`

## Notes

- Keep scope tight: no auth, no editor, no upload UI, no database.
- Publish is Git-based only.
