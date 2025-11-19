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
import { collectionJsonMessages } from "../helpers/collectionMsg";
import { WebSocket as WsClient } from "ws";
import { createClient } from "../helpers/createClientWs";

describe("WSS integration - RegisterNickname", () => {
  let httpServer: HttpServer;
  let port: number;
  const clients: WsClient[] = [];
  let wssHandle: ReturnType<typeof websocketSetup>;

  beforeAll((done) => {
    httpServer = http.createServer();
    wssHandle = websocketSetup(httpServer as unknown as any);
    httpServer.listen(0, () => {
      const addr = httpServer.address();
      if (addr && typeof addr === "object") {
        port = addr.port;
        done();
      }
    });
  }, 10000);

  afterEach(() => {
    for (const c of clients) {
      try {
        if (c.readyState !== WsClient.CLOSED) {
          c.terminate();
        }
      } catch {}
    }
    clients.length = 0;
  });

  afterAll((done) => {
    try {
      wssHandle?.close();
    } catch (error) {
      console.log(error);
    }
    httpServer.close((err) => {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  test("Server register Nickname ok & replies ack ok", async () => {
    const url = `ws://localhost:${port}`;
    const client1 = await createClient(url);
    const client2 = await createClient(url);
    clients.push(client1, client2);
    const msgId = "reg-msg-1";
    //aca tengo que crear el mensaje tipado como en los guards
    const registerNickname = {
      timestamp: Date.now(),
      type: "registerNickname",
      payload: {
        messageId: msgId,
        nickname: "nick",
      },
    };

    // despues hacer el send con el client1
    const parse = JSON.stringify(registerNickname);
    client1.send(parse);

    //despues el cliente1 recibe el ack ok y el system que avisa que ingreso

    const recs = await collectionJsonMessages(client1, 2);

    //busco el ack
    const ack = recs.find((r) => r?.type === "ack");
    expect(ack).toBeDefined();

    expect(ack.correlationId).toBe(msgId);
    expect(ack.payload?.status).toBe("ok");

    const privateSystemMsg = recs.find(
      (r) =>
        r?.type === "system" &&
        typeof r.payload?.message === "string" &&
        r.payload.message.includes("ingresaste a la sala")
    );
    expect(privateSystemMsg).toBeDefined();

    const [parsedB] = await collectionJsonMessages(client2, 1);

    expect(parsedB.type).toBe("system");
    expect(typeof parsedB.payload?.message).toBe("string");
    expect(parsedB.payload.message).toContain("ingreso a la sala");
  });

  test("Server register Nickname duplicate messageId ERROR", async () => {
    const url = `ws://localhost:${port}`;
    const client = await createClient(url);
    clients.push(client);

    const msgId = "duplicate-reg-1";
    const registerNickname = {
      timestamp: Date.now(),
      type: "registerNickname",
      payload: {
        messageId: msgId,
        nickname: "nick",
      },
    };
    client.send(JSON.stringify(registerNickname));
    const firstRecs = await collectionJsonMessages(client, 2, 4000);
    const ackeOk = firstRecs.find((r) => r?.type === "ack");
    expect(ackeOk).toBeDefined(); //ESPERAMOS A QUE ESTE DEFINIDO EL TIPO
    expect(ackeOk.correlationId).toBe(msgId);
    expect(ackeOk.payload?.status).toBe("ok");

    client.send(JSON.stringify(registerNickname));
    const secondRecs = await collectionJsonMessages(client, 1, 4000);
    const ackError = secondRecs.find((r) => r?.type === "ack");

    expect(ackError).toBeDefined();
    expect(ackError.correlationId).toBe(msgId);
    expect(ackError.payload?.status).toBe("error");
  
  });
});
