deno cache --lock=lock.json --lock-write deps.ts
deno cache --lock=packages/micro/lock.json --lock-write packages/micro/deps.ts
deno cache --lock=packages/testing/lock.json --lock-write packages/testing/deps.ts
deno run --allow-read=$PWD --allow-write=$PWD packages/scripts/sortLock.ts
