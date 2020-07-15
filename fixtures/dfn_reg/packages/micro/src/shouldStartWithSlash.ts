export const shouldStartWithSlash = (path: string) =>
  path[0] === "/" ? path : `/${path}`;
