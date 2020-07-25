import { createResponse } from "./createResponse.ts";
import { NetworkError } from "./networkError.ts";
import { Response } from "./types.ts";

export const createResponseFromError = (e: NetworkError) => {
  return createResponse({
    status: e.statusCode,
    body: e.message,
  });
};

export async function returnNetworkErrorOnCatch(
  fn: (...args: any[]) => Promise<Response>
): Promise<Response> {
  try {
    const response = await fn();
    return response;
  } catch (e) {
    let error: NetworkError;
    if (e instanceof NetworkError) error = e;
    else if (e instanceof Error)
      error = new NetworkError(500, e.message || "Internal Server Error");
    else error = new NetworkError();
    return createResponseFromError(error);
  }
}
