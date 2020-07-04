import { serve } from "https://cdn.jsdelivr.net/gh/jeroenptrs/denofn@1.0.0-rc.1/packages/micro/mod.ts";

import fn from "./registry_in/%SCRIPT_NAME%/index.ts";

await serve(fn, %PORT%);
