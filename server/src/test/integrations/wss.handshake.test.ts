import {
  describe,
  beforeAll,
  afterAll,
  afterEach,
  test,
  expect,
} from "@jest/globals";
import * as http from "http";
import type { Server as HttpServer } from "http";
import { WebSocket as WsClient } from "ws";
import { websocketSetup } from "../../websoquet.setup";

function waitForMessage(ws: WsClient, timeoutMs = 2000): Promise<string> {
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

describe("WSS integration - Handshake", () => {
  let httpServer: HttpServer;
  let port: number;
  const clients: WsClient[] = [];
  let wssHandle: ReturnType<typeof websocketSetup>

  beforeAll((done) => {
    httpServer = http.createServer();
    wssHandle=websocketSetup(httpServer as unknown as any)

    httpServer.listen(0, () => {
      const addr = httpServer.address();
      if (addr && typeof addr === "object") {
        port = addr.port;
        done();
      } else {
        done(new Error("No address returned from server.listen"));
      }
    });
  }, 10000);

  afterEach(() => {
    for (const c of clients) {
      try {
        if (c.readyState !== WsClient.CLOSED) c.terminate();
      } catch {}
    }
    clients.length = 0;
  });

  afterAll((done) => {
    try{wssHandle?.close()}catch(err){console.log(err);}
    
    httpServer.close((err) => {
      if (err) return done(err);
      done();
    });

  });

  test("Server repies whith 'conexion ws establecida' after client sends first message", async () => {
    const url = `ws://localhost:${port}`;
    const client = new WsClient(url);
    clients.push(client);

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("timeout opening client"));
      }, 2000);

      client.on("open", () => {
        clearTimeout(timer);
        resolve();
      });

      client.on("error", () => {
        clearTimeout(timer);
      });
    });
    client.send("hello server")

    const msg=await waitForMessage(client, 2000)
    expect(msg).toBe("conexion ws establecida")

    client.close
  },10000);
});
