import { normalizeManifest } from "/lib/manifest.js";
import { parseRoute } from "/lib/router.js";

const app = document.getElementById("app");

async function loadDiagrams() {
  const response = await fetch("/data/diagrams.json", { cache: "no-store" });
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
  return `/${encodeURIComponent(slug)}`;
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

function fitScale(container, image, naturalWidth, naturalHeight) {
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  if (!cw || !ch || !naturalWidth || !naturalHeight) {
    return 1;
  }
  return Math.min(cw / naturalWidth, ch / naturalHeight);
}

function renderDiagram(item) {
  const shell = createEl("section", "viewer-shell");
  const head = createEl("header", "viewer-head");
  const back = document.createElement("a");
  back.href = "/";
  back.textContent = "<- back";
  back.addEventListener("click", (event) => {
    event.preventDefault();
    navigate("/");
  });

  const title = createEl("strong", null, item.title);
  const controls = createEl("div", "controls");
  const zoomOut = createEl("button", null, "-");
  const reset = createEl("button", null, "100%");
  const zoomIn = createEl("button", null, "+");
  controls.append(zoomOut, reset, zoomIn);
  head.append(back, title, controls);

  const canvas = createEl("section", "canvas");
  const image = document.createElement("img");
  image.className = "diagram";
  image.alt = item.title;
  image.src = item.file;
  image.draggable = false;
  if (item.width) {
    image.width = item.width;
  }
  if (item.height) {
    image.height = item.height;
  }
  canvas.append(image);
  shell.append(head, canvas);
  app.replaceChildren(shell);

  const state = { x: 0, y: 0, scale: 1, startX: 0, startY: 0, dragging: false };

  function apply() {
    setTransform(image, state);
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
    const naturalWidth = image.naturalWidth || item.width || image.width;
    const naturalHeight = image.naturalHeight || item.height || image.height;
    state.scale = clampScale(fitScale(canvas, image, naturalWidth, naturalHeight));
    state.x = Math.max((canvas.clientWidth - naturalWidth * state.scale) / 2, 0);
    state.y = Math.max((canvas.clientHeight - naturalHeight * state.scale) / 2, 0);
    apply();
  }

  image.addEventListener("load", resetView);
  zoomIn.addEventListener("click", () => setScale(state.scale * 1.15));
  zoomOut.addEventListener("click", () => setScale(state.scale / 1.15));
  reset.addEventListener("click", resetView);

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.startX = event.clientX - state.x;
    state.startY = event.clientY - state.y;
    canvas.classList.add("dragging");
  });

  window.addEventListener("pointermove", (event) => {
    if (!state.dragging) {
      return;
    }
    state.x = event.clientX - state.startX;
    state.y = event.clientY - state.startY;
    apply();
  });

  window.addEventListener("pointerup", () => {
    state.dragging = false;
    canvas.classList.remove("dragging");
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "+" || event.key === "=") {
      setScale(state.scale * 1.15);
    } else if (event.key === "-") {
      setScale(state.scale / 1.15);
    } else if (event.key === "0") {
      resetView();
    } else if (event.key === "Escape") {
      navigate("/");
    } else if (event.key === "ArrowLeft") {
      state.x += 30;
      apply();
    } else if (event.key === "ArrowRight") {
      state.x -= 30;
      apply();
    } else if (event.key === "ArrowUp") {
      state.y += 30;
      apply();
    } else if (event.key === "ArrowDown") {
      state.y -= 30;
      apply();
    }
  });

  window.addEventListener("resize", () => {
    resetView();
  });
}

function renderNotFound(slug) {
  const shell = createEl("section", "shell");
  shell.append(createEl("h1", "title", "Diagram not found"));
  shell.append(createEl("p", "notice", `No published diagram exists for slug: ${slug}`));
  const link = document.createElement("a");
  link.href = "/";
  link.textContent = "Back to index";
  link.addEventListener("click", (event) => {
    event.preventDefault();
    navigate("/");
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
  const route = parseRoute(window.location.pathname.replace(/^\/diagrams/, "") || "/");
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
  renderDiagram(found);
}

window.addEventListener("popstate", () => {
  render().catch(renderError);
});

render().catch(renderError);
