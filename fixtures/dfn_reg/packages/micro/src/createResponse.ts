import * as T from "./types.ts";

export const createResponse = (r: T.Response): T.Response => {
  const headers = r.headers ?? new Headers({ "Content-Type": "text/plain; charset=utf-8" });
  const status = r.status ?? 200;
  const body = r.body ? r.body : status === 200 ? "OK" : "";

  return {
    ...r,
    headers,
    status,
    body,
  };
};
