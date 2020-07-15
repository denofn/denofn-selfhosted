import * as db from "./db.ts";

export const killProcess = (scriptName: string): void => {
  const dbEntry = db.get(scriptName);
  Deno.kill(dbEntry?.process as number, Deno.Signal.SIGINT);
  Deno.close(dbEntry?.resource as number);

  db.set(scriptName, {
    ...dbEntry,
    process: undefined,
    started: undefined,
    warmedUp: false,
    locks: new Set(),
  });
};
