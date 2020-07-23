import { readRequestBody } from "../../micro/src/readBody.ts";
import { saveIndex, saveScriptRegistry } from "../../registry/mod.ts";
import {
  db,
  getIndex,
  getPortsRegistry,
  getScriptRegistry,
  RegistryJSON,
  Request,
  Response,
  Router,
} from "../deps.ts";
import { API_V1 } from "./utils/prefixes.ts";

export async function functions(app: Router) {
  app.use(API_V1("/functions"), async (_, res) => {
    res.headers?.append("Access-Control-Allow-Origin", "*");
    return res;
  });

  app.add("get", API_V1("/functions"), functionsRouter);
  app.add("post", API_V1("/functions"), functionsPostRouter);
  app.add("options", API_V1("/functions"), functionsOptionsRouter);
}

async function functionsRouter(req: Request, res: Response): Promise<Response> {
  if (req.url === "/") return fetchAllFunctions(res);
  else {
    const scriptName = req.url.split("/")[1].split("?")[0];
    return fetchFunction(scriptName, res);
  }
}

async function functionsPostRouter(req: Request, res: Response): Promise<Response> {
  if (req.url === "/") return res;
  else {
    const scriptName = req.url.split("/")[1].split("?")[0];
    return saveFunction(scriptName, req, res);
  }
}

async function functionsOptionsRouter(req: Request, res: Response): Promise<Response> {
  if (req.url === "/") return res;
  else {
    res.status = 200;
    res.body = "OK";
    res.headers?.append("Access-Control-Allow-Headers", "content-type");
    return res;
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

async function saveFunction(scriptName: string, req: Request, res: Response): Promise<Response> {
  const data: { index: string; registry: RegistryJSON } = JSON.parse(
    await readRequestBody(req.body)
  );

  saveScriptRegistry(scriptName, data.registry);
  saveIndex(scriptName, data.index);

  res.status = 200;
  res.body = "OK";
  // res.body = JSON.stringify({ registry, index, isWarmedUp });
  return res;
}
