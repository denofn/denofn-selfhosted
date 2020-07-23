import { shouldStartWithSlash } from "../../../micro/src/shouldStartWithSlash.ts";

export const API_V1 = (endpoint: string = "") => `/api/v1${shouldStartWithSlash(endpoint)}`;
