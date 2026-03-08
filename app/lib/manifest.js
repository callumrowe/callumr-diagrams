export function normalizeManifest(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .filter((item) => item && item.slug && item.title && item.file)
    .map((item) => ({
      slug: String(item.slug),
      title: String(item.title),
      file: String(item.file),
      width: item.width ? Number(item.width) : undefined,
      height: item.height ? Number(item.height) : undefined,
    }));
}
