export function parseRoute(pathname) {
  const path = String(pathname || "/").replace(/\/+$/, "") || "/";
  if (path === "/") {
    return { type: "index" };
  }

  const slug = path.startsWith("/") ? path.slice(1) : path;
  if (!slug) {
    return { type: "index" };
  }

  return { type: "diagram", slug: decodeURIComponent(slug) };
}
