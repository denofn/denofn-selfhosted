import { NetworkError } from "./networkError.ts";

const TimeoutError = new NetworkError(408, "ECONTIMEDOUT");

export async function raceProxyAgainstTimeout(
  p: Promise<globalThis.Response>,
  timeout?: number
): Promise<globalThis.Response | NetworkError> {
  const isTimeout = !!timeout;
  let timeoutId: number;

  return Promise.race([
    p.then((res) => {
      if (isTimeout) clearTimeout(timeoutId);
      return res;
    }),
    ...(isTimeout
      ? [
          new Promise<NetworkError>((_, reject) => {
            timeoutId = setTimeout(() => reject(TimeoutError), timeout);
          }),
        ]
      : []),
  ]);
}
