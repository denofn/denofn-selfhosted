import { readRequestBody } from "../../micro/src/readBody.ts";
import {
  createScriptDir,
  db,
  getIndex,
  getPortsRegistry,
  getScriptRegistry,
  isUsr,
  RegistryJSON,
  Request,
  reservedNames,
  Response,
  Router,
  saveIndex,
  saveScriptRegistry,
} from "../deps.ts";
import { API_V1 } from "./utils/prefixes.ts";

export async function functions(app: Router) {
  app.use(API_V1("/functions"), async (req, res) => {
    res.headers?.append("Access-Control-Allow-Origin", "*");
    res.headers?.append("Access-Control-Allow-Headers", "x-denofn-user");
    const usr = req.headers.get("x-denofn-user");
    // if no usr exists but is in request, naively set it
    if (usr) isUsr(usr);
    return res;
  });

  app.add("get", API_V1("/functions"), functionsRouter);
  app.add("post", API_V1("/functions"), functionsPostRouter);
  app.add("options", API_V1("/functions"), functionsOptionsRouter);
}

async function functionsRouter(req: Request, res: Response): Promise<Response> {
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

async function functionsPostRouter(req: Request, res: Response): Promise<Response> {
  const usr = req.headers.get("x-denofn-user");
  if (!usr || !isUsr(usr))
    return {
      status: 401,
      body: "Unauthorized",
    };
  else if (req.url === "/") return createFunction(req, res);
  else {
    const scriptName = req.url.split("/")[1].split("?")[0];
    return saveFunction(scriptName, req, res);
  }
}

async function functionsOptionsRouter(req: Request, res: Response): Promise<Response> {
  res.status = 200;
  res.body = "OK";
  res.headers?.append("Access-Control-Allow-Headers", "content-type");
  return res;
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

  const doneRegistry = saveScriptRegistry(scriptName, data.registry);
  const doneIndex = saveIndex(scriptName, data.index);
  const done = doneIndex && doneRegistry;

  res.status = done ? 200 : 500;
  res.body = done ? "OK" : "Internal Server Error";
  return res;
}

async function createFunction(req: Request, res: Response): Promise<Response> {
  const {
    scriptName,
    ...data
  }: { scriptName: string; index: string; registry: RegistryJSON } = JSON.parse(
    await readRequestBody(req.body)
  );

  if (reservedNames.includes(scriptName) || !createScriptDir(scriptName))
    return {
      ...res,
      status: 403,
      body: `${scriptName} cannot be used, please use a different name`,
    };

  const doneRegistry = saveScriptRegistry(scriptName, data.registry, false);
  const doneIndex = saveIndex(scriptName, data.index, false);
  const done = doneIndex && doneRegistry;

  res.status = done ? 200 : 500;
  res.body = done ? "OK" : "Internal Server Error";
  return res;
}
