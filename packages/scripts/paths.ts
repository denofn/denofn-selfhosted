import { appendCwd } from "../shared/mod.ts";

export const lockPaths = () =>
  [`/lock.json`, `/packages/micro/lock.json`, `/packages/testing/lock.json`].map(appendCwd);
export const depsPaths = () =>
  [`/deps.ts`, `/packages/micro/deps.ts`, `/packages/testing/deps.ts`].map(appendCwd);
