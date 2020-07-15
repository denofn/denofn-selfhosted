import { createResponse } from "./createResponse.ts";
import { NetworkError } from "./networkError.ts";

export const createResponseFromError = (e: NetworkError) => {
  return createResponse({
    status: e.statusCode ?? 500,
    body: e.message ?? `Internal Server Error`,
  });
};
