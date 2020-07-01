export async function pingServer(url: string): Promise<boolean> {
  try {
    await fetch(`${url}/ping`, { method: "get" });
    return true;
  } catch (e) {
    return false;
  }
}
