import { describe, expect, test } from "@jest/globals";
import { isSendMessage, isRegisterNickname } from "../guards";

describe("isSendMessage guard", () => {
  test("Should return true for a valid public SendMessage", () => {
    const validMsgPublic = {
      type: "chat.send",
      messageId: "msg-id",
      timestamp: Date.now(),
      payload: {
        scope: "chat.public",
        toId: "toid",
        text: "msg public",
      },
    };
    expect(isSendMessage(validMsgPublic)).toBe(true);
  });

  test("Should return true for a valid private SendMessage", () => {
    const validMsgPrivate = {
      type: "chat.send",
      messageId: "msg-id",
      timestamp: Date.now(),
      payload: {
        scope: "chat.private",
        toId: "toid",
        text: "msg private",
      },
    };
    expect(isSendMessage(validMsgPrivate)).toBe(true);
  });

  test("Should return false if messageId is missing", () => {
    const missingId = {
      type: "chat.send",
      timestamp: Date.now(),
      payload: {
        scope: "chat.public",
        toId: "toid",
        text: "missing id",
      },
    };
    expect(isSendMessage(missingId)).toBe(false);
  });

  test("Should return false if scope is invalid", () => {
    const invalidScope = {
      type: "chat.send",
      messageId: "msg-id",
      timestamp: Date.now(),
      payload: {
        scope: "chat",
        toId: "toid",
        text: "scope invalid",
      },
    };
    expect(isSendMessage(invalidScope)).toBe(false);
  });

  test("Should return false if type invalid", () => {
    const invalidType = {
      type: "chat",
      messageId: "msg-id",
      timestamp: Date.now(),
      payload: {
        scope: "chat.public",
        toId: "toid",
        text: "invalid type",
      },
    };
    expect(isSendMessage(invalidType)).toBe(false);
  });

  test("Should return false if payload missing", () => {
    const missingPayload = {
      type: "chat.send",
      timestamp: Date.now(),
      messageId: "msg-id",
    };
    expect(isSendMessage(missingPayload)).toBe(false);
  });

  test("Should return false if type missing", () => {
    const missingType = {
      messageId: "msg-id",
      timestamp: Date.now(),
      payload: {
        scope: "chat.public",
        toId: "toid",
        text: "msg",
      },
    };
    expect(isSendMessage(missingType)).toBe(false);
  });

  test("Should return false if invalid text in payload", () => {
    const invalidText = {
      type: "chat.send",
      messageId: "msg-id",
      timestamp: Date.now(),
      payload: {
        scope: "chat.public",
        toId: "toid",
        text: 12345,
      },
    };
    expect(isSendMessage(invalidText)).toBe(false);
  });

  test("Should return false if missing date", () => {
    const invalidText = {
      type: "chat.send",
      messageId: "msg-id",
      payload: {
        scope: "chat.public",
        toId: "toid",
        text: "missing date",
      },
    };
    expect(isSendMessage(invalidText)).toBe(false);
  });
});

describe("isRegisterNickname guard", () => {
  test("Should return true for valid registerNickname", () => {
    const validMsg = {
      type: "registerNickname",
      timestamp: Date.now(),
      payload: {
        messageId: "msgId",
        nickname: "nick",
      },
    };
    expect(isRegisterNickname(validMsg)).toBeTruthy();
  });

  test("Should return false if missing timestamp",()=>{
    const missingTimestamp = {
      type: "registerNickname",
      payload: {
        messageId: "msgId",
        nickname: "nick",
      },
    };
    expect(isRegisterNickname(missingTimestamp)).toBeFalsy()
  });

  test("Should return false if invalid type date", ()=>{
    const invalidData = {
      type: "registerNickname",
      timestamp: "data string",
      payload: {
        messageId: "msgId",
        nickname: "nick",
      },
    };
    expect(isRegisterNickname(invalidData)).toBeFalsy()
  })

  test("Should return false if invalid type", () => {
    const invalidType = {
      type: "invalid",
      timestamp: Date.now(),
      payload: {
        messageId: "msgId",
        nickname: "nick",
      },
    };
    expect(isRegisterNickname(invalidType)).toBeFalsy();
  });

  test("Should return false if missing type", () => {
    const missingType = {
      timestamp: Date.now(),
      payload: {
        messageId: "msgId",
        nickname: "nick",
      },
    };
    expect(isRegisterNickname(missingType)).toBeFalsy();
  });

  test("Should return false if missing payload", () => {
    const missingPayload = {
      type: "registerNickname",
      timestamp: Date.now(),
    };
    expect(isRegisterNickname(missingPayload)).toBeFalsy();
  });

  test("Should return false if invalid payload messageId", () => {
    const invalidMsgId = {
      type: "registerNickname",
      timestamp: Date.now(),
      payload: {
        messageId: 1234,
        nickname: "nick",
      },
    };
    expect(isRegisterNickname(invalidMsgId)).toBeFalsy();
  });

  test("Should return false if missing messageId in payload", () => {
    const missingMsgId = {
      type: "registerNickname",
      timestamp: Date.now(),
      payload: {
        nickname: "nick",
      },
    };
    expect(isRegisterNickname(missingMsgId)).toBeFalsy();
  });

  test("Should return false if invalid Nick", () => {
    const invaliNick = {
      type: "registerNickname",
      timestamp: Date.now(),
      payload: {
        messageId: "msgId",
        nickname: 1234,
      },
    };
    expect(isRegisterNickname(invaliNick)).toBeFalsy();
  });

  test("Should return false if missing nick in payload", () => {
    const missingNick = {
      type: "registerNickname",
      timestamp: Date.now(),
      payload: {
        messageId: "msgId",
      },
    };
    expect(isRegisterNickname(missingNick)).toBeFalsy();
  });
});
