import { fileExists } from "../shared/mod.ts";
import { depsPaths } from "./paths.ts";

const newDenoFn = Deno.args[0];

depsPaths().forEach((depsPath) => {
  if (!newDenoFn) return;
  if (!fileExists(depsPath)) {
    console.error(`Deps file does not exist`);
    Deno.exit(1);
  }

  const v = newDenoFn.split("/")[1];
  console.log(v);

  const depsFile = Deno.readTextFileSync(depsPath);

  const depsV = depsFile.substr(depsFile.indexOf("std@")).split("/")[0].split("@")[1];

  Deno.writeTextFileSync(depsPath, depsFile.replaceAll(depsV, v));
});
