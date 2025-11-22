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

describe("WSS integration - SendMessage", () => {
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

  test("Server sendmessage public", async () => {
    const url = `ws://localhost:${port}`;
    const client1 = await createClient(url);
    const client2 = await createClient(url);
    clients.push(client1, client2);
    const msgId = "reg-msg-1";
    const msgId2 = "reg-msg-2";

    const registerNickname = {
      timestamp: Date.now(),
      type: "registerNickname",
      payload: {
        messageId: msgId,
        nickname: "nick",
      },
    };
    const registerNickname2 = {
      timestamp: Date.now(),
      type: "registerNickname",
      payload: {
        messageId: msgId2,
        nickname: "nick",
      },
    };
    client2.send(JSON.stringify(registerNickname2))
    await collectionJsonMessages(client2, 2)
    client1.send(JSON.stringify(registerNickname))
    await collectionJsonMessages(client1,2)
const msgIdSend= "reg-send-1"

    const sendmessage = {
      timestamp: Date.now(),
      type: "chat.send",
      messageId: msgIdSend,
      payload: {
        scope: "chat.public",
        toId: "toid",
        text: "msg public",
      },
    };

    const sendMsg = client1.send(JSON.stringify(sendmessage));
    const resMsgClient1 = await collectionJsonMessages(client1, 1);
    const ackeOk = resMsgClient1.find((res) => res?.type === "ack");
    expect(ackeOk).toBeDefined();
    expect(ackeOk.correlationId).toBe(msgIdSend);
    expect(ackeOk.payload.status).toBe("ok");

    const resMsgClient2 = await collectionJsonMessages(client2, 1);
    const publicMsg = resMsgClient2.find((res) => res?.type === "chat.public");
    expect(publicMsg).toBeDefined();
    expect(publicMsg.payload?.text).toBe("msg public");
    expect(publicMsg.payload?.fromId).toBeDefined();
  });



});
