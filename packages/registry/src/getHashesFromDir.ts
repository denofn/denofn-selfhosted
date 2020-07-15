import { appendCwd, createHash } from "../deps.ts";

export const getHashesFromDir = (dirName: string): string[] => {
  let hashes: string[] = [];

  for (const e of Deno.readDirSync(appendCwd(`/registry_in/${dirName}`))) {
    e.isDirectory
      ? hashes.push(...getHashesFromDir(`${dirName}/${e.name}`))
      : e.isFile
      ? hashes.push(
          createHash("md5")
            .update(Deno.readTextFileSync(appendCwd(`/registry_in/${dirName}/${e.name}`)))
            .toString()
        )
      : null;
  }

  return hashes;
};
