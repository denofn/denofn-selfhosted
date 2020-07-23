import { getOrigin } from "./getOrigin";

export function API_V1(path: string): string {
  return `${getOrigin()}/api/v1${path}`;
}
