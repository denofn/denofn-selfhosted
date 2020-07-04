export const fileExists = (fileName: string) => {
  try {
    Deno.readFileSync(fileName);
    return true;
  } catch {
    return false;
  }
};
