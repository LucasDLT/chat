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
import { websocketSetup } from "../../websoquet.setup.js";
import { collectionJsonMessages } from "../helpers/collectionMsg.js";
import { WebSocket as WsClient } from "ws";
import { createClient } from "../helpers/createClientWs.js";

describe("WSS integration - ChangeNickname", () => {
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
    } catch (err) {
      console.log(err);
    }
    httpServer.close((err) => {
      if (err) {
        console.log(err);
      }
      done();
    });

});
test("Server change nickname ok & replies ack ok", async () => {
  const url = `ws://localhost:${port}`;
  const client1 = await createClient(url);
  const client2 = await createClient(url);
  clients.push(client1, client2);
  const msgId = "reg-msg-1";
  const msgId2 = "reg-msg-2";
  const newNick = "newNick";

  const registerNickname = {
    timestamp: Date.now(),
    type: "registerNickname",
    payload: {
      messageId: msgId,
      nickname: "oldNick",
    },
  };
  const sendParsedReg = client1.send(JSON.stringify(registerNickname));
  await collectionJsonMessages(client1, 2);
  const oldNick = registerNickname.payload.nickname

  const changeNickname = {
    timestamp: Date.now(),
    type: "changeNickname",
    payload: {
      messageId: msgId2,
      userId: "userId",
      nickname: newNick,
    },
  };
  const sendParsedChange = client1.send(JSON.stringify(changeNickname));
  const resMsgs = await collectionJsonMessages(client1, 2);
  
  const ackOk = resMsgs.find((res) => res?.type === "ack");
  expect(ackOk).toBeDefined();

  expect(ackOk.correlationId).toBe(msgId2);
  expect(ackOk.payload?.status).toBe("ok");

  const msgOkSystem = resMsgs.find((res) => res?.type === "system" &&
      typeof res.payload?.message === "string" &&
      res.payload.message.includes(`${oldNick} cambiaste a ${newNick}`)
  );
  expect(msgOkSystem).toBeDefined();
});
test("Server change nickname duplicate messageId ERROR", async () => {
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
  expect(ackeOk).toBeDefined(); 
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
