deno cache --lock=lock.json --lock-write deps.ts
deno run --allow-read --allow-write scripts/sortLock.ts
