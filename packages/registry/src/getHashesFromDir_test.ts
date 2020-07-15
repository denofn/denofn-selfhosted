import {
  assertEquals,
  removeRegistryScriptFolder,
  writeRegistryScriptFolder,
  writeScript,
  writeSymlink,
} from "../../testing/mod.ts";

import { getHashesFromDir } from "./getHashesFromDir.ts";

Deno.test("shouldn't do anything with empty folders", () => {
  writeRegistryScriptFolder("test");

  assertEquals(getHashesFromDir("test").length, 0);

  removeRegistryScriptFolder("test");
});

Deno.test("should hash text files", () => {
  writeRegistryScriptFolder("test");
  writeScript("test", ``);

  assertEquals(getHashesFromDir("test").length, 1);

  removeRegistryScriptFolder("test");
});

Deno.test("shouldn't do anything with symlinks", () => {
  writeRegistryScriptFolder("test");
  writeScript("test", ``);
  writeSymlink("/test/index.ts", "/test/test2.ts");

  assertEquals(getHashesFromDir("test").length, 1);

  removeRegistryScriptFolder("test");
});

Deno.test("should hash several levels deeps", () => {
  writeRegistryScriptFolder("test");
  writeRegistryScriptFolder("test/level");
  writeScript("test", ``);
  writeScript("test/level", ``);

  assertEquals(getHashesFromDir("test").length, 2);

  removeRegistryScriptFolder("test");
});
