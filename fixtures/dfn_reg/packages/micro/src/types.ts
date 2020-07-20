import { server } from "../deps.ts";
import { methods } from "./methods.ts";

export type LibHandler = (req: server.ServerRequest) => Promise<Response>;
export type Handler = (req: Request, res: Response) => Promise<Response>;
export type Response = server.Response;
export type Request = server.ServerRequest;
export type OldRequest = {
  body: () => Deno.Reader;
  contentLength: () => number | null;
  headers: Headers;
  url: string;
  method: string;
  proto: string;
  protoMajor: number;
  protoMinor: number;
};

export type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export type Methods = ElementType<typeof methods>;
