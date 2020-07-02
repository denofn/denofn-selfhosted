FROM hayd/deno:alpine-1.1.1

WORKDIR /functions

RUN mkdir registry
RUN mkdir registry_in
RUN mkdir templates

COPY deps.ts /functions
COPY lock.json /functions
COPY fromCache.sh /functions
RUN ./fromCache.sh

COPY templates/bundle.ts /functions/templates
ADD ./src/registry /functions/src/registry
ADD ./src/shared /functions/src/shared
ADD ./src/micro /functions/src/micro
RUN deno cache src/registry/index.ts

CMD ["run", "--allow-read", "--allow-write", "--allow-run", "./src/registry/index.ts", "silent"]
