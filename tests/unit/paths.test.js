import test from "node:test";
import assert from "node:assert/strict";
import { getBasePath, pathWithoutBase, buildDataPath, buildLinkPath, buildFilePath } from "../../app/lib/paths.js";

test("path helpers support root and /diagrams base path", () => {
  assert.equal(getBasePath("/diagrams"), "/diagrams");
  assert.equal(getBasePath("/diagrams/my-diagram"), "/diagrams");
  assert.equal(getBasePath("/my-diagram"), "");

  assert.equal(pathWithoutBase("/diagrams/my-diagram", "/diagrams"), "/my-diagram");
  assert.equal(pathWithoutBase("/my-diagram", ""), "/my-diagram");

  assert.equal(buildDataPath("/diagrams"), "/diagrams/data/diagrams.json");
  assert.equal(buildLinkPath("my-diagram", "/diagrams"), "/diagrams/my-diagram");
  assert.equal(buildFilePath("/assets/diagrams/x.png", "/diagrams"), "/diagrams/assets/diagrams/x.png");
});
