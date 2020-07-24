import { appendCwd, dirExists, fileExists, Request, Response, Router, serveFile } from "../deps.ts";

export async function registerStatic(app: Router) {
  app.use(indexRouter);
  app.use("/static", staticRouter);
}

async function staticRouter(req: Request, res: Response): Promise<Response> {
  const path = appendCwd(`/static${req.url}`);
  if (dirExists(path))
    return {
      ...res,
      status: 401,
      body: "Unauthorized",
    };
  else if (!dirExists(path) && !fileExists(path))
    return {
      ...res,
      status: 404,
      body: "Not found",
    };

  return serveFile(req, path);
}

async function indexRouter(req: Request, res: Response): Promise<Response> {
  if (req.url.split("?")[0] === "/" || req.url === "/index.html") {
    // console.log("index.html");
    const path = appendCwd(`/static/index.html`);
    return serveFile(req, path);
  } else if (req.url === "/favicon.ico") {
    // console.log("favicon.ico");
    const path = appendCwd(`/static/favicon.ico`);
    return serveFile(req, path);
  } else return res;
}
