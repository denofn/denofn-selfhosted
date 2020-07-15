export const filterOutQuery = (path: string) => path.split("?")[0];
export const filterOutTrailingSlash = (url: string) => url.replace(/\/$/, "");
