export const appendCwd = (path: string) =>
  `${Deno.cwd()}${path.startsWith("/") ? path : `/${path}`}`;
