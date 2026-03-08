import { SVG } from "./vendor/svg.esm.js";

const NODE_FILL = "#ffffff";
const NODE_STROKE = "#b9c0c7";
const EDGE_COLOR = "#6e7781";
const TEXT_COLOR = "#1f2328";
const PADDING = 48;

const COLOR_MAP = {
  "1": "#fef3c7",
  "2": "#dbeafe",
  "3": "#dcfce7",
  "4": "#fce7f3",
  "5": "#fff7ed",
  "6": "#ede9fe",
};

const SIDE_SET = new Set(["top", "right", "bottom", "left"]);

export function isCanvasFile(file) {
  return String(file || "").toLowerCase().endsWith(".canvas");
}

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeTextNode(node) {
  return {
    id: String(node.id),
    text: String(node.text || ""),
    x: toNumber(node.x, 0),
    y: toNumber(node.y, 0),
    width: Math.max(40, toNumber(node.width, 180)),
    height: Math.max(28, toNumber(node.height, 80)),
    color: node.color == null ? null : String(node.color),
  };
}

function normalizeEdge(edge) {
  return {
    id: String(edge.id),
    fromNode: String(edge.fromNode),
    toNode: String(edge.toNode),
    fromSide: SIDE_SET.has(edge.fromSide) ? edge.fromSide : "right",
    toSide: SIDE_SET.has(edge.toSide) ? edge.toSide : "left",
    fromEnd: edge.fromEnd === "arrow" ? "arrow" : null,
    color: edge.color == null ? null : String(edge.color),
  };
}

export function normalizeCanvasModel(raw) {
  const rawNodes = Array.isArray(raw?.nodes) ? raw.nodes : [];
  const nodes = rawNodes
    .filter((node) => node && node.type === "text" && node.id != null)
    .map(normalizeTextNode);

  const idSet = new Set(nodes.map((node) => node.id));
  const rawEdges = Array.isArray(raw?.edges) ? raw.edges : [];
  const edges = rawEdges
    .filter((edge) => edge && edge.id != null && idSet.has(edge.fromNode) && idSet.has(edge.toNode))
    .map(normalizeEdge);

  return { nodes, edges };
}

function getAnchor(node, side) {
  if (side === "top") {
    return { x: node.x + node.width / 2, y: node.y };
  }
  if (side === "bottom") {
    return { x: node.x + node.width / 2, y: node.y + node.height };
  }
  if (side === "left") {
    return { x: node.x, y: node.y + node.height / 2 };
  }
  return { x: node.x + node.width, y: node.y + node.height / 2 };
}

function estimateLineLimit(width) {
  return Math.max(10, Math.floor((width - 20) / 7.2));
}

function wrapLine(line, maxChars) {
  const words = String(line).split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [""];
  }

  const lines = [];
  let current = words[0];
  for (let i = 1; i < words.length; i += 1) {
    const next = `${current} ${words[i]}`;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }
    lines.push(current);
    current = words[i];
  }
  lines.push(current);
  return lines;
}

function wrapText(text, width) {
  const maxChars = estimateLineLimit(width);
  const source = String(text || "").split("\n");
  const lines = [];
  for (const line of source) {
    lines.push(...wrapLine(line, maxChars));
  }
  return lines;
}

function getBounds(nodes) {
  if (nodes.length === 0) {
    return { minX: -320, minY: -180, maxX: 320, maxY: 180 };
  }
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const node of nodes) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + node.width);
    maxY = Math.max(maxY, node.y + node.height);
  }
  return { minX, minY, maxX, maxY };
}

function colorForNode(node) {
  return COLOR_MAP[node.color] || NODE_FILL;
}

export function renderCanvasDiagram({ container, model }) {
  const shell = document.createElement("div");
  shell.className = "diagram diagram-canvas";

  const bounds = getBounds(model.nodes);
  const width = Math.max(200, bounds.maxX - bounds.minX + PADDING * 2);
  const height = Math.max(140, bounds.maxY - bounds.minY + PADDING * 2);
  const offsetX = PADDING - bounds.minX;
  const offsetY = PADDING - bounds.minY;
  const byId = new Map(model.nodes.map((node) => [node.id, node]));

  const draw = SVG().addTo(shell).size(width, height).viewbox(0, 0, width, height);

  const arrowMarker = draw
    .marker(12, 12, (add) => {
      add.polygon("0,0 12,6 0,12").fill(EDGE_COLOR);
    })
    .ref(10, 6)
    .orient("auto");

  const edgeLayer = draw.group();
  const nodeLayer = draw.group();

  for (const edge of model.edges) {
    const fromNode = byId.get(edge.fromNode);
    const toNode = byId.get(edge.toNode);
    if (!fromNode || !toNode) {
      continue;
    }

    const start = getAnchor(fromNode, edge.fromSide);
    const end = getAnchor(toNode, edge.toSide);
    const stroke = COLOR_MAP[edge.color] || EDGE_COLOR;
    const line = edgeLayer
      .line(start.x + offsetX, start.y + offsetY, end.x + offsetX, end.y + offsetY)
      .stroke({ width: 2.2, color: stroke, linecap: "round" });
    if (edge.fromEnd === "arrow") {
      line.marker("start", arrowMarker);
    }
  }

  for (const node of model.nodes) {
    const group = nodeLayer.group();
    group
      .rect(node.width, node.height)
      .move(node.x + offsetX, node.y + offsetY)
      .radius(8)
      .fill(colorForNode(node))
      .stroke({ width: 1, color: NODE_STROKE });

    const lines = wrapText(node.text, node.width);
    const text = group
      .text((add) => {
        for (const line of lines) {
          add.tspan(line).newLine();
        }
      })
      .font({
        family: "IBM Plex Mono, SFMono-Regular, Menlo, Consolas, monospace",
        size: 13,
        leading: 1.35,
      })
      .fill(TEXT_COLOR)
      .move(node.x + offsetX + 10, node.y + offsetY + 8);
    text.attr({ "pointer-events": "none" });
  }

  container.replaceChildren(shell);
  return {
    element: shell,
    width,
    height,
    dispose() {
      draw.clear();
    },
  };
}
