export function getBasePath(pathname) {
  const value = String(pathname || "");
  return /^\/diagrams(?:\/|$)/.test(value) ? "/diagrams" : "";
}

export function pathWithoutBase(pathname, basePath) {
  const value = String(pathname || "/");
  if (!basePath) {
    return value || "/";
  }
  if (value === basePath) {
    return "/";
  }
  if (value.startsWith(`${basePath}/`)) {
    return value.slice(basePath.length) || "/";
  }
  return value || "/";
}

export function buildDataPath(basePath) {
  return `${basePath}/data/diagrams.json`;
}

export function buildLinkPath(slug, basePath) {
  return `${basePath}/${encodeURIComponent(slug)}`;
}

export function buildFilePath(file, basePath) {
  const value = String(file || "");
  if (/^(https?:|data:)/i.test(value)) {
    return value;
  }
  if (value.startsWith("/")) {
    return `${basePath}${value}`;
  }
  return `${basePath}/${value}`;
}
