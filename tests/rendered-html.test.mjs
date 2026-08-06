import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Status Zero dashboard", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Status Zero/i);
  assert.match(html, /ChatGPT/i);
  assert.match(html, /Claude/i);
  assert.doesNotMatch(html, /Starter Project|codex-preview/i);
});

test("standalone dashboards are branded and self-contained", async () => {
  const [professional, whimsical, index, packageJson] = await Promise.all([
    readFile(new URL("../Status Zero.html", import.meta.url), "utf8"),
    readFile(new URL("../Status Zero Whimsical.html", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const html of [professional, whimsical, index]) {
    assert.match(html, /Status Zero/i);
    assert.match(html, /status\.openai\.com/);
    assert.match(html, /status\.claude\.com/);
  }

  assert.equal(index, professional);
  assert.match(packageJson, /"name"\s*:\s*"status-zero"/);
});
