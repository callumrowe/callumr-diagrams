import { normalizeManifest } from "/lib/manifest.js";
import { parseRoute } from "/lib/router.js";
import { getBasePath, pathWithoutBase, buildDataPath, buildLinkPath, buildFilePath } from "/lib/paths.js";
import { JSONCanvasViewer, parser, Controls, Minimap } from "/lib/vendor/json-canvas-viewer.chimp.js";

const app = document.getElementById("app");
const basePath = getBasePath(window.location.pathname);

async function loadDiagrams() {
  const response = await fetch(buildDataPath(basePath), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load manifest: ${response.status}`);
  }
  const raw = await response.json();
  return normalizeManifest(raw);
}

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  if (text != null) {
    el.textContent = text;
  }
  return el;
}

function navigate(path) {
  history.pushState({}, "", path);
  render().catch(renderError);
}

function linkFor(slug) {
  return buildLinkPath(slug, basePath);
}

function renderIndex(items) {
  const shell = createEl("section", "shell");
  shell.append(createEl("h1", "title", "Diagrams"));
  shell.append(createEl("p", "subtle", "Models, ideas, and product thinking."));

  const list = createEl("ul", "list");
  for (const item of items) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = linkFor(item.slug);
    link.textContent = item.title;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(linkFor(item.slug));
    });
    li.append(link);
    list.append(li);
  }

  shell.append(list);
  app.replaceChildren(shell);
}

function setTransform(target, state) {
  target.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
}

function clampScale(value) {
  return Math.max(0.1, Math.min(8, value));
}

function isCanvasFile(file) {
  return String(file || "").toLowerCase().endsWith(".canvas");
}

async function renderDiagram(item) {
  const canvasDiagram = isCanvasFile(item.file);
  const shell = createEl("section", "viewer-shell");
  const head = createEl("header", "viewer-head");
  const back = document.createElement("a");
  back.href = basePath || "/";
  back.textContent = "<- back";
  back.addEventListener("click", (event) => {
    event.preventDefault();
    navigate(basePath || "/");
  });

  const title = createEl("strong", null, item.title);
  let controls = null;
  let zoomOut = null;
  let reset = null;
  let zoomIn = null;
  if (!canvasDiagram) {
    controls = createEl("div", "controls");
    zoomOut = createEl("button", null, "-");
    reset = createEl("button", null, "100%");
    zoomIn = createEl("button", null, "+");
    controls.append(zoomOut, reset, zoomIn);
    head.append(back, title, controls);
  } else {
    head.append(back, title);
  }

  const canvas = createEl("section", "canvas");
  shell.append(head, canvas);
  app.replaceChildren(shell);

  let target = null;
  let intrinsicWidth = toPositiveNumber(item.width);
  let intrinsicHeight = toPositiveNumber(item.height);

  if (canvasDiagram) {
    try {
      const canvasHost = createEl("div", "diagram diagram-canvas-host");
      canvas.append(canvasHost);
      const response = await fetch(buildFilePath(item.file, basePath), { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Could not load canvas file: ${response.status}`);
      }
      const parsed = await response.json();
      const viewer = new JSONCanvasViewer(
        {
          container: canvasHost,
          canvas: parsed,
          parser,
        },
        [Controls, Minimap],
      );
      viewer.resetView();
    } catch (error) {
      const failure = createEl("p", "notice", error.message || "Could not render canvas diagram");
      canvas.replaceChildren(failure);
    }
  } else {
    const image = document.createElement("img");
    image.className = "diagram";
    image.alt = item.title;
    image.src = buildFilePath(item.file, basePath);
    image.draggable = false;
    image.addEventListener("load", () => {
      intrinsicWidth = toPositiveNumber(image.naturalWidth) || intrinsicWidth;
      intrinsicHeight = toPositiveNumber(image.naturalHeight) || intrinsicHeight;
      resetView();
    });
    image.addEventListener("error", () => {
      const failure = createEl("p", "notice", `Could not load image: ${image.src}`);
      canvas.replaceChildren(failure);
    });
    canvas.append(image);
    target = image;
  }

  const state = { x: 0, y: 0, scale: 1, startX: 0, startY: 0, dragging: false };

  function apply() {
    if (target) {
      setTransform(target, state);
    }
  }

  function setScale(next, anchorX = canvas.clientWidth / 2, anchorY = canvas.clientHeight / 2) {
    const before = state.scale;
    state.scale = clampScale(next);
    const ratio = state.scale / before;
    state.x = anchorX - (anchorX - state.x) * ratio;
    state.y = anchorY - (anchorY - state.y) * ratio;
    apply();
  }

  function resetView() {
    const width = toPositiveNumber(intrinsicWidth);
    const height = toPositiveNumber(intrinsicHeight);
    if (!width || !height) {
      state.scale = 1;
      state.x = 0;
      state.y = 0;
      apply();
      return;
    }
    const fit = Math.min((canvas.clientWidth * 0.92) / width, (canvas.clientHeight * 0.92) / height, 1);
    state.scale = clampScale(fit);
    state.x = (canvas.clientWidth - width * state.scale) / 2;
    state.y = (canvas.clientHeight - height * state.scale) / 2;
    apply();
  }

  if (!canvasDiagram && target) {
    resetView();
  }
  if (!canvasDiagram) {
    zoomIn.addEventListener("click", () => setScale(state.scale * 1.15));
    zoomOut.addEventListener("click", () => setScale(state.scale / 1.15));
    reset.addEventListener("click", resetView);
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (canvasDiagram) {
      return;
    }
    state.dragging = true;
    state.startX = event.clientX - state.x;
    state.startY = event.clientY - state.y;
    canvas.classList.add("dragging");
  });

  window.addEventListener("pointermove", (event) => {
    if (canvasDiagram) {
      return;
    }
    if (!state.dragging) {
      return;
    }
    state.x = event.clientX - state.startX;
    state.y = event.clientY - state.startY;
    apply();
  });

  window.addEventListener("pointerup", () => {
    if (canvasDiagram) {
      return;
    }
    state.dragging = false;
    canvas.classList.remove("dragging");
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "+" || event.key === "=") {
      if (canvasDiagram) {
        return;
      }
      setScale(state.scale * 1.15);
    } else if (event.key === "-") {
      if (canvasDiagram) {
        return;
      }
      setScale(state.scale / 1.15);
    } else if (event.key === "0") {
      if (canvasDiagram) {
        return;
      }
      resetView();
    } else if (event.key === "Escape") {
      navigate(basePath || "/");
    } else if (event.key === "ArrowLeft") {
      if (canvasDiagram) {
        return;
      }
      state.x += 30;
      apply();
    } else if (event.key === "ArrowRight") {
      if (canvasDiagram) {
        return;
      }
      state.x -= 30;
      apply();
    } else if (event.key === "ArrowUp") {
      if (canvasDiagram) {
        return;
      }
      state.y += 30;
      apply();
    } else if (event.key === "ArrowDown") {
      if (canvasDiagram) {
        return;
      }
      state.y -= 30;
      apply();
    }
  });

  window.addEventListener("resize", () => {
    if (canvasDiagram) {
      return;
    }
    resetView();
  });
}

function renderNotFound(slug) {
  const shell = createEl("section", "shell");
  shell.append(createEl("h1", "title", "Diagram not found"));
  shell.append(createEl("p", "notice", `No published diagram exists for slug: ${slug}`));
  const link = document.createElement("a");
  link.href = basePath || "/";
  link.textContent = "Back to index";
  link.addEventListener("click", (event) => {
    event.preventDefault();
    navigate(basePath || "/");
  });
  shell.append(link);
  app.replaceChildren(shell);
}

function renderError(error) {
  const shell = createEl("section", "shell");
  shell.append(createEl("h1", "title", "Unable to load diagrams"));
  shell.append(createEl("p", "notice", error.message));
  app.replaceChildren(shell);
}

async function render() {
  const route = parseRoute(pathWithoutBase(window.location.pathname, basePath) || "/");
  const items = await loadDiagrams();
  if (route.type === "index") {
    renderIndex(items);
    return;
  }
  const found = items.find((item) => item.slug === route.slug);
  if (!found) {
    renderNotFound(route.slug);
    return;
  }
  await renderDiagram(found);
}

function toPositiveNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

window.addEventListener("popstate", () => {
  render().catch(renderError);
});

render().catch(renderError);
