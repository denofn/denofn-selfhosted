import { appendCwd } from "../shared/mod.ts";

const appendPwd = Deno.args[0]
  ? (path: string) => `${Deno.args[0]}${path.startsWith("/") ? path : `/${path}`}`
  : appendCwd;

const indexHtml = Deno.readTextFileSync(appendPwd("/static/index.html"));

Deno.writeTextFileSync(
  appendPwd("/static/index.html"),
  indexHtml
    .replace(`href="/favicon.ico"`, `href="/static/favicon.ico"`)
    .replace(`href="/manifest.json"`, `href="/static/manifest.json"`)
);
