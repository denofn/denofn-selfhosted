export const dirExists = (dirName: string) => {
  try {
    Deno.readDirSync(dirName);
    return true;
  } catch {
    return false;
  }
};
