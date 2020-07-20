import { assertEquals, BufReader } from "../../testing/mod.ts";
import { server } from "../deps.ts";
import { buildRequest } from "./buildRequest.ts";

const encoder = new TextEncoder();

Deno.test("should build request", async () => {
  // sets the proxy url
  {
    const req = new server.ServerRequest();
    req.headers = new Headers({ "content-length": "5" });
    req.method = "post";
    req.r = new BufReader(new Deno.Buffer(encoder.encode("Hello")));
    req.url = "/world";

    const [path, builtRequest] = await buildRequest("https://test.url", req);

    assertEquals(path, `https://test.url/world`);
    assertEquals(builtRequest, {
      headers: new Headers({ "content-length": "5", connection: "close" }),
      method: "post",
      body: "Hello",
      mode: "cors",
    });
  }
});
