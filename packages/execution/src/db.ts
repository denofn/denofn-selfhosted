import { compareWithNow, logger } from "../deps.ts";

type DbEntry = {
  process?: number;
  resource?: number;
  warmedUp: boolean;
  started?: number;
  locks: Set<string>;
};

const db = new Map<string, DbEntry>();

export const set = (key: string, data: Partial<DbEntry>) => {
  if (!db.has(key)) {
    return db.set(key, { ...data, locks: new Set(), warmedUp: false });
  }

  return db.set(key, { ...(db.get(key) ?? {}), ...data } as DbEntry);
};

export const get = (key: string) => db.get(key);

export const has = (key: string) => db.has(key);

export const hasStarted = (key: string) =>
  has(key) ? Boolean(get(key)?.started) : false;

export const isWarmedUp = (key: string) =>
  has(key) ? Boolean(get(key)?.warmedUp) : false;

export const isLocked = (key: string) =>
  has(key) ? Boolean((get(key)?.locks?.size ?? 0) >= 1) : false;

export const createLock = (key: string, lock: string) => {
  logger.script(key, `Creating lock ${lock}`, "info");

  const locks = set(key, {}).get(key)?.locks as Set<string>;

  locks.add(lock);

  return set(key, { locks });
};

export const freeLock = (
  key: string,
  lock: string,
  started: number,
  _lockStarted?: number,
) => {
  logger.script(key, `Freeing lock ${lock}`, "verbose");

  const locks = get(key)?.locks as Set<string>;

  locks.delete(lock);
  logger.script(
    key,
    `Lock ${lock} lasted ${compareWithNow(_lockStarted ?? started)}ms`,
    "info",
  );

  return set(key, { locks, started });
};
