import { Request, Response } from "../../deps.ts";

export async function functionsOptionsRouter(req: Request, res: Response): Promise<Response> {
  res.status = 200;
  res.body = "OK";
  res.headers?.append("Access-Control-Allow-Headers", "content-type");
  return res;
}
