export const appendHeaders = (
  baseHeaders: Headers = new Headers(),
  toAppendHeaders: Headers = new Headers()
): Headers => {
  const newHeaders = new Headers(baseHeaders);

  for (const [field, value] of toAppendHeaders.entries()) {
    newHeaders.set(field, value);
  }

  return newHeaders;
};
