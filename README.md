# deno_functions_local

Self hosted FaaS provider, made with Deno.
This is created as a learning opportunity to:

1. work with Deno and think about application security
1. try to DIY a FaaS provider from scratch, in Typescript
1. dogfood other DIY tools while creating a frontend/tooling/scripts
1. improve Dockerfile / docker compose knowledge
1. ultimately have a fun playground / home integration tool on a server somewhere

## Todos

1. [ ] Functions Registry
   1. [x] Bundle with Deno
   1. [x] Port provision in registry
   1. [ ] Permission provision in registry
   1. [ ] Allow serving static files (map asset name to filename?)
   1. [ ] Registry UI
      1. [ ] Upload files
      1. [ ] Change permissions
      1. [ ] Remove registration via mounted volume
1. [ ] Spawn, execute, kill
   1. [x] Execution server
   1. [x] Spawn subprocess for requests
   1. [x] Kill process after X seconds of idleness
   1. [ ] Auto warmup, configured in registry
   1. [ ] Allow SPA stuff (routing in scriptHandler)
   1. [ ] Persist logs
   1. [ ] Monitoring dashboard UI
1. [x] Docker
   1. [x] Create Dockerfile for registry
   1. [x] Create Dockerfile for execution
   1. [x] Create docker-compose file
1. Lib improvements
   1. [ ] Opine is quite messy in implementation (see registerScriptHandler.ts)
   1. [ ] Provide own library to wrap functions with (router, serving, ...)
   1. [ ] Think about monorepos in Deno (and how to organize them)
   1. [ ] Testing
   1. [ ] Script running (`./cache.sh`, ...)
