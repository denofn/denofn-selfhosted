import { wait } from "../deps.ts";
import * as db from "./db.ts";

export const waitAndCheckHasBeenWarmedUp = (ms: number, key: string) => async () => {
  await wait(ms);
  return db.isWarmedUp(key);
};
