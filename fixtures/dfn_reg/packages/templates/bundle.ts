import { serve } from "./packages/micro/mod.ts";

import fn from "./registry_in/%SCRIPT_NAME%/index.ts";

console.log("%SCRIPT_NAME%");
await serve(fn, %PORT%);
