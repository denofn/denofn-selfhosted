# denoFn

Self hosted FaaS provider, made with Deno.
This is created as a learning opportunity to:

1. work with Deno and think about application security
1. try to DIY a FaaS provider from scratch, in Typescript
1. dogfood other DIY tools while creating a frontend/tooling/scripts
1. improve Dockerfile / docker compose knowledge
1. ultimately have a fun playground / home integration tool on a server somewhere

## Prerequisites

- Docker (and docker-compose)
- Deno v1.1.1 and above
- VSCode will prompt you to install specific extensions, it is advised to at least install the Deno extension

## Local development/contribution

_NOTE: further instructions are written towards UNIX systems since .sh scripts are used. But this probably all works on Windows as well._

### Testing inside Docker

- `./buildAndRun.sh`

### Testing on you machine

- `mkdir registry && mkdir registry_in`
- place your functions in `registry_in`
- `./registry.sh`
- `./execution.sh`

### Contributing new deps

- Non versioned dependencies will not be allowed
- run `./cache.sh` for opening a PR

## Function layout

- [folder] scriptName
  - index.ts
  - registry.json
  - ... other code

This will map in `registry` to

- scriptName.js
- scriptName.json

### index.ts

```ts
import { createHandler } from "../../src/micro/mod.ts";

export default createHandler((_) => "Hello, world");
```

`createHandler` gives you a Request object and requires a string or Response object. See typings in `src/micro/mod.ts`.

TODO: use deno.land or github/unpkg in example to micro/mod.ts

### registry.json

```json
{
  "permissions": [],
  "warmupOnStart": true
}
```

TODO: Permission provision in registry

- `permissions`: `deno run` permissions. Will probably disallow `--allow-run`
- `warmupOnStart`: will bootstrap your function immediately upon docker initialization. This is still a bit flaky as there are race conditions with registration, will be fixed soon.

## Todos

1. [ ] Functions Registry
   1. [x] Bundle with Deno
   1. [x] Port provision in registry
   1. [ ] Permission provision in registry
   1. [ ] Allow serving static files (map asset name to filename?)
   1. [ ] Handle functions without --allow-net?
      - Assume they run in one go. No warmup needed. Pure process spawning, calculation, and done.
      - Different type of handler needed as well
      - Override console to combat fiddling with output
1. [ ] Spawn, execute, kill
   1. [x] Execution server
   1. [x] Spawn subprocess for requests
   1. [x] Kill process after X seconds of idleness
   1. [x] Auto warmup, configured in registry
      1. [ ] Properly defer checks when file isn't registered yet
   1. [ ] Allow SPA stuff (wildcard routing in scriptHandler)
   1. [ ] Persist logs
1. [ ] Frontend
   1. [ ] Registry UI
      1. [ ] Upload files
      1. [ ] Change permissions
      1. [ ] Remove registration via mounted volume
      1. [ ] Refresh code
   1. [ ] Monitoring dashboard UI
1. [x] Docker
   1. [x] Create Dockerfile for registry
   1. [x] Create Dockerfile for execution
   1. [x] Create docker-compose file
1. [ ] Lib improvements
   1. [ ] Opine is quite messy in implementation (see registerScriptHandler.ts)
   1. [x] Provide own library to wrap functions with (router, serving, ...)
   1. [ ] Think about monorepos in Deno (and how to organize them)
   1. [ ] Testing
   1. [ ] Script running (`./cache.sh`, ...)
