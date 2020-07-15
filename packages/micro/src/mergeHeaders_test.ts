import { assertEquals } from "../../testing/mod.ts";
import { mergeHeaders } from "./mergeHeaders.ts";

Deno.test("should merge headers", () => {
  const initialHeaders = new Headers({ a: "a", b: "b", c: "c" });
  const otherHeaders = new Headers({ b: "b", c: "d", e: "e" });
  const resultHeaders = new Headers({ a: "a", b: "b", c: "d", e: "e" });

  assertEquals(
    Array.from(mergeHeaders(initialHeaders, otherHeaders).entries()),
    Array.from(resultHeaders.entries())
  );
});
