import { serve } from "./packages/micro/src/serve.ts";
import fn from "./registry_in/%SCRIPT_NAME%/index.ts";

console.log("%SCRIPT_NAME%");
await serve(%PORT%, fn);
