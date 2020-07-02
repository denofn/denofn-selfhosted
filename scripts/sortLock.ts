import { fileExists } from "../src/shared/fileExists.ts";
import { appendCwd } from "../src/shared/path.ts";

const lockPath = appendCwd(`/lock.json`);

if (!fileExists(lockPath)) {
  console.error(`Lock file does not exist`);
  Deno.exit(1);
}

const lockFile: Record<string, string> = JSON.parse(
  Deno.readTextFileSync(lockPath),
);

const newLock: Record<string, string> = {};
Object.keys(lockFile).sort().forEach((k) => {
  newLock[k] = lockFile[k];
});

Deno.writeTextFileSync(lockPath, JSON.stringify(newLock, null, 2));
