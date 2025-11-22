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
import { create } from "domain";
import { timeStamp } from "console";

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
    client2.send(JSON.stringify(registerNickname2));
    await collectionJsonMessages(client2, 2);
    client1.send(JSON.stringify(registerNickname));
    await collectionJsonMessages(client1, 2);
    const msgIdSend = "reg-send-1";

    const sendmessage = {
      timestamp: Date.now(),
      type: "chat.send",
      messageId: msgIdSend,
      payload: {
        scope: "chat.public",
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

  test("Server sendmessage private", async () => {
    const url = `ws://localhost:${port}`;
    const client1 = await createClient(url);
    const client2 = await createClient(url);
    clients.push(client1, client2);

    const msgId = "reg-msgId-1";

    const registerClient1 = {
      timestamp: Date.now(),
      type: "registerNickname",
      payload: {
        messageId: msgId,
        nickname: "nick",
      },
    };

    const msgId2 = "reg-msgId-2";

    const registerClient2 = {
      timestamp: Date.now(),
      type: "registerNickname",
      payload: {
        messageId: msgId2,
        nickname: "nick",
      },
    };

    client1.send(JSON.stringify(registerClient1));
    const resClient1 = await collectionJsonMessages(client1, 2);
    const ackeOkClient1 = resClient1.find((res) => res?.type === "ack");
    expect(ackeOkClient1).toBeDefined();

    const IdClient1 = ackeOkClient1.payload.fromId;
    expect(IdClient1).toBeDefined();

    client2.send(JSON.stringify(registerClient2));
    const resClient2 = await collectionJsonMessages(client2, 2);
    const ackeOkClient2 = resClient2.find((res) => res?.type === "ack");
    expect(ackeOkClient2).toBeDefined();

    const IdClient2 = ackeOkClient2.payload.fromId;
    expect(IdClient2).toBeDefined();

    const msgIdPrivate = "reg-msg-private";

    const sendmessageClient1 = {
      timestamp: Date.now(),
      type: "chat.send",
      messageId: msgIdPrivate,
      payload: {
        scope: "chat.private",
        toId: IdClient2,
        text: "msg private",
      },
    };
    client1.send(JSON.stringify(sendmessageClient1));
    const resPrivateMsgClient1 = await collectionJsonMessages(client1, 2);
    const ackPrivate = resPrivateMsgClient1.find((res) => res?.type === "ack");
    expect(ackPrivate).toBeDefined();
    expect(ackPrivate.payload.status).toBeDefined();
    expect(ackPrivate.payload.status).toBe("ok");

    const resPrivateMsgClient2 = await collectionJsonMessages(client2, 1);

    const systemMsg = resPrivateMsgClient2.find(
      (res) => res?.type === "chat.private"
    );
    expect(systemMsg).toBeDefined();
    expect(systemMsg.payload?.fromId).toBeDefined();
    expect(systemMsg.payload?.fromId).toBe(IdClient1);
    expect(systemMsg.payload?.toId).toBe(IdClient2);
    expect(systemMsg.payload?.text).toBe("msg private");
  });

  test("Server sendmessage duplicate", async () => {
    const url = `ws://localhost:${port}`;
    const client1 = await createClient(url);
    const client2 = await createClient(url);
    clients.push(client1, client2);

    const msgId = "reg-msgId-reg";

    const registerClient1 = {
      timestamp: Date.now(),
      type: "registerNickname",
      payload: {
        messageId: msgId,
        nickname: "nick",
      },
    };    
    client1.send(JSON.stringify(registerClient1));
    const resClient1 = await collectionJsonMessages(client1, 1);
    const ackeOkClient1 = resClient1.find((res) => res?.type === "ack");
    expect(ackeOkClient1).toBeDefined();    
    expect(ackeOkClient1.payload?.status).toBe("ok");
    
    const msgIdDup = "reg-msgId-dup";
    const sendmessageClient1 = {
      timestamp: Date.now(),
      type: "chat.send",
      messageId: msgIdDup,
      payload: {
        scope: "chat.public",
        text: "msg public",
      },
    };
    client1.send(JSON.stringify(sendmessageClient1));
    const resPublicMsgClient1 = await collectionJsonMessages(client1, 1);
    const ackPublic = resPublicMsgClient1.find((res) => res?.type === "ack");
    expect(ackPublic).toBeDefined();
    expect(ackPublic.payload.status).toBeDefined();
    expect(ackPublic.payload.status).toBe("ok");
    
    const duplicateMessage={
      timestamp: Date.now(),
      type: "chat.send",
      messageId: msgIdDup,
      payload: {
        scope: "chat.public",
        text: "msg public",
      },
    }
    
    client1.send(JSON.stringify(duplicateMessage));
    const resPublicMsgClient1Dup = await collectionJsonMessages(client1, 1);
    const ackPublicDup = resPublicMsgClient1Dup.find((res) => res?.type === "ack");
    expect(ackPublicDup).toBeDefined();
    expect(ackPublicDup.payload.status).toBeDefined();
    expect(ackPublicDup.payload.status).toBe("error");
    expect(ackPublicDup.payload.details).toBe("duplicate");
  });
});
