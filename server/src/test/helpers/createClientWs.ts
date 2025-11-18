import { WebSocket as WsClient } from "ws";
export function createClient(url: string): Promise<WsClient> {
  return new Promise((resolve, reject) => {
    const client = new WsClient(url);
    const timer = setTimeout(
      () => reject(new Error("Timeout opening client")),
      1000
    );
    client.once("open", () => {
      clearTimeout(timer);
      resolve(client);
    });
    client.once("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}
