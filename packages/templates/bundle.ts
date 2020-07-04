// TODO: reference to github/jsdeliver
import { serve } from "./packages/micro/mod.ts";

import fn from "./registry_in/%SCRIPT_NAME%/index.ts";

await serve(fn, %PORT%);
