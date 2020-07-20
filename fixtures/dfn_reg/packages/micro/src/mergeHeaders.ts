export const mergeHeaders = (
  baseHeaders: Headers = new Headers(),
  toMergeWithHeaders: Headers = new Headers()
): Headers => {
  const newHeaders = new Headers(baseHeaders);

  for (const [field, value] of toMergeWithHeaders.entries()) {
    newHeaders.set(field, value);
  }

  return newHeaders;
};
