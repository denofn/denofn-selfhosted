import { fileExists } from "../shared/mod.ts";
import { lockPaths } from "./paths.ts";

lockPaths().forEach((lockPath) => {
  if (!fileExists(lockPath)) {
    console.error(`Lock file does not exist`);
    Deno.exit(1);
  }

  const lockFile: Record<string, string> = JSON.parse(Deno.readTextFileSync(lockPath));

  const newLock: Record<string, string> = {};
  Object.keys(lockFile)
    .sort()
    .forEach((k) => {
      newLock[k] = lockFile[k];
    });

  Deno.writeTextFileSync(lockPath, JSON.stringify(newLock, null, 2));
});
