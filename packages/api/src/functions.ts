import { db, getPortsRegistry, Request, Response, Router } from "../deps.ts";
import { API_V1 } from "./utils/prefixes.ts";

export async function functions(app: Router) {
  app.use(API_V1("/functions"), async (_, res) => {
    res.headers?.append("Access-Control-Allow-Origin", "*");
    return res;
  });

  app.add("get", API_V1("/functions"), functionsRouter);
}

async function functionsRouter(req: Request, res: Response): Promise<Response> {
  if (req.url === "/") return fetchAllFunctions(res);
  else return res;
}

async function fetchAllFunctions(response: Response): Promise<Response> {
  const result: Record<string, boolean> = {};
  const apps = Object.keys(getPortsRegistry()).sort();

  for (const app of apps) {
    result[app] = db.isWarmedUp(app);
  }

  response.headers?.set("content-type", "application/json");
  response.status = 200;
  response.body = JSON.stringify(result);
  return response;
}
