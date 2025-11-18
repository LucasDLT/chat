
import { WebSocket as WsClient } from "ws";

export function waitForMessage(ws: WsClient, timeoutMs = 2000): Promise<string> {
  return new Promise((resolve, reject) => {
    const onMessage = (data: unknown) => {
      cleanup();

      const raw = data instanceof Buffer ? data.toString() : String(data);
      resolve(raw);
    };

    const onClose = () => {
      cleanup();
      reject(new Error("socket closed before message"));
    };

    const onError = (err: Error) => {
      cleanup();
      reject(err);
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("timeout waiting for message"));
    }, timeoutMs);

    function cleanup() {
      clearTimeout(timer);
      ws.off("message", onMessage);
      ws.off("close", onClose);
      ws.off("error", onError);
    }
    ws.on("message", onMessage);
    ws.on("close", onClose);
    ws.on("error", onError);
  });
}