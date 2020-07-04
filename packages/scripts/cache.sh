deno cache --lock=lock.json --lock-write deps.ts
deno run --allow-read=$PWD --allow-write=$PWD packages/scripts/sortLock.ts
