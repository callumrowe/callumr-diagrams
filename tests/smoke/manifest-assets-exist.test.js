import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("every local manifest file path exists under app", () => {
  const raw = JSON.parse(readFileSync("app/data/diagrams.json", "utf8"));
  for (const item of raw) {
    const file = String(item.file || "");
    if (file.startsWith("http://") || file.startsWith("https://") || file.startsWith("data:")) {
      continue;
    }
    const rel = file.startsWith("/") ? file.slice(1) : file;
    assert.equal(existsSync(`app/${rel}`), true, `missing asset for slug ${item.slug}: ${file}`);
    if (file.toLowerCase().endsWith(".canvas")) {
      assert.doesNotThrow(() => JSON.parse(readFileSync(`app/${rel}`, "utf8")));
    }
  }
});
