import { serve } from "./src/micro/mod.ts";

import fn from "./registry_in/%SCRIPT_NAME%/index.ts";

await serve(fn, %PORT%);
