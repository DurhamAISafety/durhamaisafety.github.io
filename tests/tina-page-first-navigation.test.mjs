import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the CMS registers page-first navigation rather than duplicate page sections", async () => {
  const [config, contentConfig, pages, programmes, getInvolved] = await Promise.all([
    read("tina/config.ts"),
    read("src/content.config.ts"),
    read("tina/collections/pages.ts"),
    read("tina/collections/programmes.ts"),
    read("tina/collections/get-involved.ts"),
  ]);

  assert.match(config, /siteConfigCollection/);
  assert.match(config, /homePageCollection/);
  assert.match(config, /aboutPageCollection/);
  assert.match(config, /researchPageCollection/);
  assert.match(config, /programmesCollection/);
  assert.match(config, /getInvolvedCollection/);
  assert.doesNotMatch(config, /supportersCollection|peopleCollection|researchCollection/);
  assert.doesNotMatch(contentConfig, /people\.yml|supporters\.yml|research\.yml/);
  assert.match(pages, /supportersField/);
  assert.match(pages, /peopleField/);
  assert.match(pages, /papersField/);
  assert.match(programmes, /label: "Programmes Page"/);
  assert.match(getInvolved, /label: "Get Involved Page"/);
});

test("home, about and research page documents own the records shown on their previews", async () => {
  const [home, about, research] = await Promise.all([
    read("src/content/pages/home.yml"),
    read("src/content/pages/about.yml"),
    read("src/content/pages/research.yml"),
  ]);

  assert.match(home, /^  supporters:/m);
  assert.match(about, /^  people:/m);
  assert.match(research, /^  papers:/m);

  await Promise.all([
    assert.rejects(access(new URL("../src/content/supporters.yml", import.meta.url))),
    assert.rejects(access(new URL("../src/content/people.yml", import.meta.url))),
    assert.rejects(access(new URL("../src/content/research.yml", import.meta.url))),
  ]);
});

test("nested record loaders query the page document that owns their fields", async () => {
  const [supporters, people, research] = await Promise.all([
    read("src/data/supporters.ts"),
    read("src/data/people.ts"),
    read("src/data/research.ts"),
  ]);

  assert.match(supporters, /client\.queries\.homePage/);
  assert.match(people, /client\.queries\.aboutPage/);
  assert.match(research, /client\.queries\.researchPage/);
});

test("Astro checks do not diagnose Tina's generated admin application", async () => {
  const tsconfig = await read("tsconfig.json");

  assert.match(tsconfig, /"public\/admin"/);
});
