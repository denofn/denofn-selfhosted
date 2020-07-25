import { assertEquals } from "../../testing/mod.ts";
import { server } from "../deps.ts";
import { createHandler } from "./createHandler.ts";
import { createResponse } from "./createResponse.ts";
import { NetworkError } from "./networkError.ts";
import { Handler, Request, Response } from "./types.ts";

const mockHandler = (fn: () => Response): Handler => async (_: Request, __: Response) => fn();
const mockRequest = new server.ServerRequest();

Deno.test("should return handler response", async () => {
  const libHandler = createHandler(
    mockHandler(() => createResponse({ status: 200, body: "test" }))
  );
  const response = await libHandler(mockRequest);
  assertEquals(response.status, 200);
  assertEquals(response.body, "test");

  // should fill in the gaps
  {
    assertEquals(Array.from(response.headers!.entries()), [
      ["content-type", "text/plain; charset=utf-8"],
    ]);
  }
});

Deno.test("should return error response", async () => {
  const libHandler = createHandler(
    mockHandler(() => {
      throw new NetworkError(404, "Not found");
    })
  );

  const response = await libHandler(mockRequest);
  assertEquals(response.status, 404);
  assertEquals(response.body, "Not found");
});

Deno.test("should return generic error response", async () => {
  const libHandler = createHandler(
    mockHandler(() => {
      throw new Error();
    })
  );

  const response = await libHandler(mockRequest);
  assertEquals(response.status, 500);
  assertEquals(response.body, "Internal Server Error");
});
