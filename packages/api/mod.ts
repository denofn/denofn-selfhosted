import { Router } from "./deps.ts";
import { functions } from "./src/functions.ts";
import { registerStatic } from "./src/static.ts";
import { API_V1 } from "./src/utils/prefixes.ts";

export function api(app: Router) {
  app.use(API_V1("/"), async () => {
    return {
      headers: new Headers({ "content-type": "text/plain; charset=utf-8" }),
      status: 404,
      body: "Not found",
    };
  });

  functions(app);
  registerStatic(app);
}
