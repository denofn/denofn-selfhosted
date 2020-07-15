import { createResponse } from "./createResponse.ts";
import { Router } from "./router.ts";

const app = new Router();

app.use(async (req) => {
  console.log(req.url);
  const headers = new Headers();
  headers.set("Content-Type", "text/plain; charset=utf-8");
  return createResponse({
    headers,
    body: "OK",
    status: 200,
  });
});

app.listen(8000);
