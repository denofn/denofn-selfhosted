import {
  db,
  getIndex,
  getPortsRegistry,
  getScriptRegistry,
  isUsr,
  Request,
  Response,
} from "../../deps.ts";

export async function functionsGetRouter(req: Request, res: Response): Promise<Response> {
  const usr = req.headers.get("x-denofn-user");
  if (!usr || !isUsr(usr))
    return {
      status: 401,
      body: "Unauthorized",
    };
  else if (req.url === "/") return fetchAllFunctions(res);
  else {
    const scriptName = req.url.split("/")[1].split("?")[0];
    return fetchFunction(scriptName, res);
  }
}

async function fetchAllFunctions(res: Response): Promise<Response> {
  const result: Record<string, boolean> = {};
  const apps = Object.keys(getPortsRegistry()).sort();

  for (const app of apps) {
    result[app] = db.isWarmedUp(app);
  }

  res.headers?.set("content-type", "application/json");
  res.status = 200;
  res.body = JSON.stringify(result);
  return res;
}

async function fetchFunction(scriptName: string, res: Response): Promise<Response> {
  const registry = getScriptRegistry(scriptName);
  const index = getIndex(scriptName);
  const isWarmedUp = db.isWarmedUp(scriptName);

  res.headers?.set("content-type", "application/json");
  res.status = 200;
  res.body = JSON.stringify({ registry, index, isWarmedUp });
  return res;
}
