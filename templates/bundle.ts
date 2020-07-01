import { serve } from "https://deno.land/std/http/server.ts";

import fn from "./registry_in/%SCRIPT_NAME%/index.ts";

const run = async () => {
  const server = serve({ port: %PORT% });
  console.log("%SCRIPT_NAME%")

  for await (const req of server) {
    fn(req);
  }
};

await run();
