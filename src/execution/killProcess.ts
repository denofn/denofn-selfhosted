import * as c from "./constants.ts";
import * as db from "./db.ts";

export const killProcess = (scriptName: string) => {
  const delta = (Date.now() - (db.get(scriptName)?.started as number)) /
    c.SECOND_IN_MS;

  if (delta > c.MAX_DELTA_LEN) {
    console.log(`Terminating old instance ${scriptName}`);

    const dbEntry = db.get(scriptName);
    Deno.kill(dbEntry?.process as number, Deno.Signal.SIGINT);

    db.set(
      scriptName,
      { ...dbEntry, process: undefined, started: undefined, warmedUp: false },
    );
  }
};
