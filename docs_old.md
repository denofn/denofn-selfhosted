## Local development/contributing

### Prerequisites

- Docker (and docker-compose)
- The latest version of Deno is installed inside the Docker containers
- VSCode will prompt you to install specific extensions, it is advised to at least install the Deno extension
- Node.js and Yarn are required if you want to tinker with the UI

_NOTE: further instructions are written towards UNIX systems since .sh scripts are used. But this probably all works on Windows as well._

### Contributing new deps

- Non versioned dependencies will not be allowed
- run `./denofn.sh cache update` for opening a PR

### Running inside Docker

`./denofn.sh` takes various commands, depending on what you want to do:

- `build` uses docker-compose to build all docker images
- `static <PATH>` creates a new build of the UI inside the `static` folder. Only necessary when there are changes inside `registry-ui`
- `up <PATH>` creates volumes at selected path and docker-compose up
- `down` docker-compose down + removes volumes
- `update <PATH>` down + build + up
- `log` docker-compose logs
- `clear <PATH>` clears registry folder at selected path
- `cache <reload|update>`
  - `reload` will fetch all dependencies on your local machine, using the lock.json. Kind of like `npm install/yarn`
  - `update` will fetch updates and new dependencies and add them to lock.json. Kind of like `npm install <packages>/yarn add <packages>`
- `test` runs unit tests for all packages or specific package

### Running tests

`./denofn.sh test` will run all unit tests. It runs tests per package in a specific entry point (`fixtures/dfn_reg/` for `packages/registry`, `fixtures/dfn_srv` for `packages/execution`, shared doesn't have fixtures)

You can run them separately by adding the package name as a second argument (currently only tests for `shared` and `registry` exist): `./denofn.sh test registry`.

#### Updating test fixtures

Testing the bundling part of `registry` depends on `packages/micro` and `packages/templates` to be provided.

Running `./denofn.sh test update` will copy the latest versions of those source files to `fixtures/dfn_reg` so the tests can run.

If functionality has been updated, do update fixtures first as a precaution.

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
import {
  createHandler,
  createResponse,
} from "https://cdn.jsdelivr.net/gh/denofn/denofn-selfhosted@1.0.0/packages/micro/functions/mod.ts";

export default createHandler(async (req, res) => {
  return createResponse({
    body: "Hello, World",
  });
});
```

`createHandler` gives you a server Request and an empty Response object that you can populate with your data. A Handler always returns a Response and _must always be async_.

### registry.json

```json
{
  "whitelist": [],
  "warmupOnStart": true
}
```

- `whitelist`: all domains that are allowed for `--allow-net`
- `warmupOnStart`: will bootstrap your function immediately upon docker initialization. This is still a bit flaky as there are race conditions with registration, will be fixed soon.

## Logging

### Logging to papertrail

Uncomment the logging section in `docker-compose.yml` and add your own logging URL.

### Log levels

- `verbose` logs everything
- `info` informative logging (spawning of locks, warmup and system info, ...)
- `file` anything related to files/processes (reading/writing files, spawning/killing deno processes)

#### Setting loglevels

You can set the log level under the `command` section in `docker-compose.yml` for each container. Passing non-accepted variables result in logging defaulting to `info`.
