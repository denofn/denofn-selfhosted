FROM deno/alpine:latest

WORKDIR /functions

RUN mkdir registry

COPY denofn.sh /functions
COPY deps.ts /functions
COPY lock.json /functions
ADD packages /functions/packages

RUN /functions/denofn.sh cache reload
RUN deno cache --unstable ./packages/execution/src/index.ts

ENTRYPOINT ["deno", "run", "--unstable", "--allow-read=/functions", "--allow-write=/functions", "--allow-net", "--allow-run", "./packages/execution/src/index.ts"]
