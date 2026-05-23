import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagesCollectionSource = await readFile(
  new URL("../tina/collections/pages.ts", import.meta.url),
  "utf8",
);

test("Tina page collection configuration is safe to bundle in the browser", () => {
  assert.doesNotMatch(pagesCollectionSource, /from\s+["'](?:node:)?fs["']/);
  assert.doesNotMatch(pagesCollectionSource, /from\s+["'](?:node:)?path["']/);
  assert.doesNotMatch(pagesCollectionSource, /\bprocess\.cwd\s*\(/);
});

test("Tina research colour choices retain branded Tailwind classes", () => {
  for (const colourClass of [
    "text-durham-purple",
    "text-deep-purple",
    "text-bright-purple",
    "text-light-purple",
    "text-lavender",
    "text-ocean-blue",
    "text-navy",
  ]) {
    assert.match(pagesCollectionSource, new RegExp(`value: "${colourClass}"`));
  }
});
