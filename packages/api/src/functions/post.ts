import { readRequestBody } from "../../../micro/src/readBody.ts";
import {
  createScriptDir,
  isUsr,
  RegistryJSON,
  Request,
  reservedNames,
  Response,
  saveIndex,
  saveScriptRegistry,
} from "../../deps.ts";

export async function functionsPostRouter(req: Request, res: Response): Promise<Response> {
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
