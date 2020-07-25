import { assertEquals, ServerRequest } from "../../testing/mod.ts";
import { createResponse } from "./createResponse.ts";
import { Router } from "./router.ts";

const req1 = () => Object.assign({}, new ServerRequest(), { method: "get", url: "/" });
const req2 = () => Object.assign({}, new ServerRequest(), { method: "get", url: "/test" });
const req3 = () => Object.assign({}, new ServerRequest(), { method: "get", url: "/test?abc" });
const req4 = () => Object.assign({}, new ServerRequest(), { method: "get", url: "/test/abc" });
const req5 = () => Object.assign({}, new ServerRequest(), { method: "get", url: "/testt" });

const body1 = "Hello, World!";
const body2 = "Hello, Test!";

const app = new Router();
app.use("/", async () => createResponse({ body: body1 }));
app.use("/test", async () => createResponse({ body: body2 }));

Deno.test("should respond with data on request", async () => {
  const response = await app.handle(req1(), createResponse({}));
  assertEquals(response.body, body1);
});

Deno.test("should respond with different data on different routes", async () => {
  const response1 = await app.handle(req1(), createResponse({}));
  const response2 = await app.handle(req2(), createResponse({}));
  assertEquals(response1.body, body1);
  assertEquals(response2.body, body2);
});

Deno.test("should still route subroutes and queries to parent route", async () => {
  const response3 = await app.handle(req3(), createResponse({}));
  const response4 = await app.handle(req4(), createResponse({}));
  assertEquals(response3.body, body2);
  assertEquals(response4.body, body2);
});

Deno.test("should properly resolve routes and fallback to 404", async () => {
  const response5 = await app.handle(req5(), createResponse({}));
  assertEquals(response5.body, `Cannot find ${req5().url}`);
});

Deno.test(
  "should properly resolve routes and fallback to default route when provided",
  async () => {
    const _app = new Router();
    _app.use(async (_, res) => ({ ...res, body: body1 }));
    _app.use("/test", async (_, res) => ({ ...res, body: body2 }));
    const response5 = await _app.handle(req5(), createResponse({}));
    assertEquals(response5.body, body1);
  }
);

Deno.test("should make clear distinction between app.use with or without route", async () => {
  const _app = new Router();
  _app.use(async () => createResponse({ body: "1" }));
  _app.use("", async () => createResponse({ body: "2" }));
  const responseA = await _app.handle(req1(), createResponse({}));
  const responseB = await _app.handle(req2(), createResponse({}));
  assertEquals(responseA.body, "2");
  assertEquals(responseB.body, "1");
});
