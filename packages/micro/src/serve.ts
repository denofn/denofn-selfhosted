import { server } from "../deps.ts";
import * as T from "./types.ts";

export async function serve(port: number, handler: T.LibHandler) {
  for await (const req of server.serve({ port })) {
    const res = await handler(req);
    req.respond(res);
  }
}
