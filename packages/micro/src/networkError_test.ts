import { assertEquals } from "../../testing/mod.ts";
import { NetworkError } from "./networkError.ts";

Deno.test("NetworkError", () => {
  const defaultNetworkError = new NetworkError();
  assertEquals(defaultNetworkError.statusCode, 500);
  assertEquals(defaultNetworkError.message, "Internal Server Error");

  let newNetworkError = new NetworkError(404, "Not found");
  assertEquals(newNetworkError.statusCode, 404);
  assertEquals(newNetworkError.message, "Not found");

  newNetworkError = new NetworkError(undefined, "Not found");
  assertEquals(newNetworkError.statusCode, defaultNetworkError.statusCode);
  assertEquals(newNetworkError.message, "Not found");

  newNetworkError = new NetworkError(404);
  assertEquals(newNetworkError.statusCode, 404);
  assertEquals(newNetworkError.message, defaultNetworkError.message);
});
