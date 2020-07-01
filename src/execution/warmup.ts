import { wait } from "../shared/wait.ts";
import * as c from "./constants.ts";
import * as db from "./db.ts";
import { pingServer } from "./pingServer.ts";

async function waitAndPing(ms: number, url: string) {
  await wait(ms);
  return pingServer(url);
}

export const warmup = async (scriptName: string, proxyUrl: string) => {
  const warmupIncrement = c.TIMEOUT_INCREMENT;
  let warmup = db.get(scriptName)?.warmup || warmupIncrement;

  const started = Date.now();
  let a = await waitAndPing(warmup, proxyUrl);

  // TODO: add max # retries
  while (!a) {
    a = await waitAndPing(warmupIncrement, proxyUrl);
  }

  const delta = Date.now() - started;
  if (delta > warmup + warmupIncrement) warmup = delta;

  return [warmup, started];
};

export const waitAndCheckHasBeenWarmedUp = (ms: number, key: string) =>
  async () => {
    await wait(ms);
    return db.isWarmedUp(key);
  };
