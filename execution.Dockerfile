FROM hayd/deno:alpine-1.1.1

WORKDIR /functions

RUN mkdir registry

COPY deps.ts /functions
COPY lock.json /functions
COPY fromCache.sh /functions
RUN ./fromCache.sh

ADD ./src/execution /functions/src/execution
ADD ./src/registry/registry.ts /functions/src/registry/registry.ts
ADD ./src/shared /functions/src/shared
RUN deno cache --unstable src/execution/index.ts

CMD ["run", "--unstable", "--allow-read", "--allow-write", "--allow-net", "--allow-run", "./src/execution/index.ts"]
