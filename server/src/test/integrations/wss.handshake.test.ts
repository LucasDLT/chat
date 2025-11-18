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
import { websocketSetup } from "../../websoquet.setup";
import { waitForMessage } from "../helpers/waitMsg";
import { WebSocket as WsClient } from "ws";
import {createClient} from '../helpers/createClientWs'
 

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

  test("Server replies whith 'conexion ws establecida' after client sends first message", async () => {
    const url = `ws://localhost:${port}`;
    const client = await createClient(url)
    clients.push(client);

    client.send("hello server")

    const msg=await waitForMessage(client, 2000)
    expect(msg).toBe("conexion ws establecida")

    client.close
  },10000);
});
