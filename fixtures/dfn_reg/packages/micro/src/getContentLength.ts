const encoder = new TextEncoder();
export const getContentLength = (content: string) =>
  encoder.encode(content).byteLength;
