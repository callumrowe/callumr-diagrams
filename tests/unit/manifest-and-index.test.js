import test from "node:test";
import assert from "node:assert/strict";
import { normalizeManifest } from "../../app/lib/manifest.js";

test("normalizeManifest keeps required fields", () => {
  const data = [
    { slug: "roadmap-v1", title: "Roadmap V1", file: "roadmap-v1.png", extra: "x" },
  ];
  const out = normalizeManifest(data);
  assert.deepEqual(out, [
    { slug: "roadmap-v1", title: "Roadmap V1", file: "roadmap-v1.png", width: undefined, height: undefined },
  ]);
});
