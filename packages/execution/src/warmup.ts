import { pingServer, wait } from "../deps.ts";
import * as c from "./constants.ts";
import * as db from "./db.ts";

export const warmup = async (scriptName: string, proxyUrl: string) => {
  const warmupIncrement = c.TIMEOUT_INCREMENT;
  let warmup = db.get(scriptName)?.warmup ?? warmupIncrement;

  const started = Date.now();
  let a = await waitAndPing(warmup, proxyUrl);

  let retries = 0;
  while (!a && retries < c.MAX_TIMEOUT_COUNT) {
    a = await waitAndPing(warmupIncrement, proxyUrl);
    retries++;
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

const waitAndPing = async (ms: number, url: string) => {
  await wait(ms);
  return pingServer(url);
};
