const decoder = new TextDecoder();

export async function readRequestBody(r: Deno.Reader) {
  const raw = await Deno.readAll(r);
  return decoder.decode(raw);
}

export async function readResponseBody(r: globalThis.Response) {
  const bufferedResponse = await r.arrayBuffer();
  return decoder.decode(bufferedResponse);
}
