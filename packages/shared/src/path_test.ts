import { assertEquals } from "../../testing/mod.ts";

import { appendCwd } from "./path.ts";

Deno.test("should respect the forward slash", () => {
  assertEquals(appendCwd(`test`), appendCwd(`/test`));
});
