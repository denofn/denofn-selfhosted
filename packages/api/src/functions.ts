import { isUsr, Router } from "../deps.ts";
import { functionsGetRouter } from "./functions/get.ts";
import { functionsOptionsRouter } from "./functions/options.ts";
import { functionsPostRouter } from "./functions/post.ts";
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

  app.add("get", API_V1("/functions"), functionsGetRouter);
  app.add("post", API_V1("/functions"), functionsPostRouter);
  app.add("options", API_V1("/functions"), functionsOptionsRouter);
}
