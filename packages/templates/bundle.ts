import { serve } from "https://cdn.jsdelivr.net/gh/jeroenptrs/denofn@1.0.0-rc.3/packages/micro/mod.ts";

import fn from "./registry_in/%SCRIPT_NAME%/index.ts";

console.log("%SCRIPT_NAME%");
await serve(fn, %PORT%);
