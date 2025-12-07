
import { WebSocket as WsClient } from "ws";

export function collectionJsonMessages(ws: WsClient, n:number, timeoutMs = 2000): Promise<any[]> {
    const messages:any[]=[]
    
    return new Promise((resolve, reject) => {
    const onMessage = (data: unknown) => {
      const raw = data instanceof Buffer ? data.toString() : String(data);
        try {
            const parsed=JSON.parse(raw)
            if (parsed.type !== "snapshot:clients" ) {
              messages.push(parsed)
              
            }

            if (messages.length>=n) {
                cleanup()
                resolve(messages)
            }
        } catch (error) {
            
        }
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
      reject(new Error(`timeout collecting ${n} JSON messages`));
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