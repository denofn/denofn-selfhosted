#!/bin/sh

down()
{
  # shut down anything that's running rn
  docker-compose down;

  # delete any volumes named registry or registry_in
  docker volume rm -f registry;
  docker volume rm -f registry_in;
}

up()
{
  # bind variable
  REGISTRY_PARENT_DIR=$1

  # create volumes mapped to argument $PATH
  docker volume create --driver local -o o=bind -o type=none \
  -o device=$REGISTRY_PARENT_DIR/registry registry;
  docker volume create --driver local -o o=bind -o type=none \
  -o device=$REGISTRY_PARENT_DIR/registry_in registry_in;

  # run dockers
  docker-compose up -d;
}

build()
{
  # build base docker image
  DENO_VERSION=`cat ./DENO_VERSION`
  docker build -t deno-alpine:$DENO_VERSION -t deno-alpine:latest -f Dockerfile --build-arg version=$DENO_VERSION .

  # create dockerfiles
  docker-compose build;
}

build_static()
{
  rm -rf $1/static
  cd $1/packages/registry-ui;
  rm -rf ./build
  yarn && yarn build
  mv ./build/static ../../static
  cp ./build/* ../../static
  cd ../../
  deno run --allow-read --allow-write $1/packages/scripts/addStaticToHtml.ts $1
}

clear()
{
  # bind variable
  REGISTRY_PARENT_DIR=$1

  # explicitly only clear /registry
  rm -r $REGISTRY_PARENT_DIR/registry/*
}

cache()
{
  if [ $1 = "reload" ]
    then
      ./packages/scripts/fromCache.sh;
  fi

  if [ $1 = "update" ]
    then
      ./packages/scripts/cache.sh;
  fi
}

log()
{
  docker-compose logs;
}

update_packages_fixtures()
{
  cp -R packages/templates fixtures/dfn_reg/packages;
  cp -R packages/micro fixtures/dfn_reg/packages;
}

clean_up_fixtures()
{
  yes | rm -rf registry/*;
  yes | rm -rf registry_in/*;
}

run_deno_test()
{
  c=$PWD;

  if [ $1 = "update" ]
    then
      update_packages_fixtures
  fi

  if [ -z $1 ] || [ $1 = "shared" ]
    then
      echo "[packages/shared]";
      echo "-----------------";
      deno test --unstable --allow-read packages/shared;
  fi

  if [ -z $1 ] || [ $1 = "micro" ]
    then
      echo "[packages/micro]";
      echo "---------------";
      deno test --unstable --allow-read --allow-net packages/micro;
  fi

  if [ -z $1 ] || [ $1 = "registry" ]
    then
      echo "[packages/registry]";
      echo "-------------------";
      cd $c/fixtures/dfn_reg && deno test --unstable --allow-net --allow-run --allow-read --allow-write ../../packages/registry;
      clean_up_fixtures;
  fi

  if [ -z $1 ] || [ $1 = "execution" ]
    then
      echo "[packages/execution]";
      echo "--------------------";
      cd $c/fixtures/dfn_srv && deno test --unstable --allow-run --allow-read --allow-write ../../packages/execution;
      clean_up_fixtures;
  fi
}

# $1 => up | down | static | build | clear | cache | update | log
# $1 => registry and intake parent directory

if [ $1 = "down" ]
  then
    down;
fi

if [ $1 = "up" ]
  then
    up $2;
fi

if [ $1 = "build" ]
  then
    build;
fi

if [ $1 = "static" ]
  then
    build_static $2;
fi

if [ $1 = "clear" ]
  then
    clear $2;
fi

if [ $1 = "cache" ]
  # $2 => update | reload
  then
    cache $2;
fi

# down + build + up
if [ $1 = "update" ]
  then
    down;
    build;
    up $2;
fi

if [ $1 = "log" ]
  then
    log;
fi

if [ $1 = "test" ]
  # $2 is empty or shared | registry | execution | micro | update
  then
    run_deno_test $2;
fi
