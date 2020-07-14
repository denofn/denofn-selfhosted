import { server } from "../deps.ts";
import * as T from "./types.ts";

export async function serve(handler: T.LibHandler, port: number) {
  for await (const req of server.serve({ port })) {
    const res = await handler(req);
    req.respond(res);
  }
}
