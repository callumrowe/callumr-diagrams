import test from "node:test";
import assert from "node:assert/strict";
import { parseRoute } from "../../app/lib/router.js";

test("parseRoute extracts slug from path", () => {
  assert.deepEqual(parseRoute("/"), { type: "index" });
  assert.deepEqual(parseRoute("/roadmap-v1"), { type: "diagram", slug: "roadmap-v1" });
});
