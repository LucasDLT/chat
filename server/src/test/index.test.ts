import { describe, expect, test } from "@jest/globals";
import { isSendMessage, isRegisterNickname, isChangeNickname } from "../guards";

describe("isSendMessage guard", () => {
  test("Should return true for a valid public SendMessage", () => {
    const validMsgPublic = {
      type: "chat.send",
      messageId: "msg-id",
      timestamp: Date.now(),
      payload: {
        scope: "chat.public",
        text: "msg public",
      },
    };
    expect(isSendMessage(validMsgPublic)).toBe(true);
  });

  test("Should return false if unexpected content in type",()=>{
    const invalidContent = {
      type: "chat.send",
      messageId: "msg-id",
      timestamp: Date.now(),
      invalid:"",
      payload: {
        scope: "chat.public",
        text: "msg public",
      },
    };
    expect(isSendMessage(invalidContent)).toBeFalsy()
  })

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

  test("Should return false if unexpected content on type",()=>{
     const invalidContent = {
      type: "registerNickname",
      timestamp: Date.now(),
      invalid:"",
      payload: {
        messageId: "msgId",
        nickname: "nick",
      },
    };
    expect(isRegisterNickname(invalidContent)).toBeFalsy()
  })
  test("Should return false if missing timestamp", () => {
    const missingTimestamp = {
      type: "registerNickname",
      payload: {
        messageId: "msgId",
        nickname: "nick",
      },
    };
    expect(isRegisterNickname(missingTimestamp)).toBeFalsy();
  });

  test("Should return false if invalid type date", () => {
    const invalidData = {
      type: "registerNickname",
      timestamp: "data string",
      payload: {
        messageId: "msgId",
        nickname: "nick",
      },
    };
    expect(isRegisterNickname(invalidData)).toBeFalsy();
  });

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

  test("Should return false if unexpected content in payload",()=>{
    const invalidPayload = {
      type: "registerNickname",
      timestamp: Date.now(),
      payload: {
        messageId: 1234,
        nickname: "nick",
        invalid:""
      },
    };
    expect(isRegisterNickname(invalidPayload)).toBeFalsy()
  })

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

describe("isChangeNickname", () => {
  test("Should return true if type isChangeNickname", () => {
    const validChangeNickname = {
      type: "changeNickname",
      timestamp: Date.now(),
      payload: {
        messageId: "string",
        userId: "string",
        nickname: "string",
      },
    };
    expect(isChangeNickname(validChangeNickname)).toBeTruthy();
  });

  test("Should return false if unexpected content on type",()=>{
    const invalidContent = {
      type: "changeNickname",
      timestamp: Date.now(),
      invalid:"",
      payload: {
        messageId: "string",
        userId: "string",
        nickname: "string",
      },
    };
    expect(isChangeNickname(invalidContent)).toBeFalsy()
  })

  test("Should return false if missing type", () => {
    const validChangeNickname = {
      timestamp: Date.now(),
      payload: {
        messageId: "string",
        userId: "string",
        nickname: "string",
      },
    };
    expect(isChangeNickname(validChangeNickname)).toBeFalsy();
  });

  test("Should return false if invalid value of type", () => {
    const invalidTypeValue = {
      type: "type",
      timestamp: Date.now(),
      payload: {
        messageId: "string",
        userId: "string",
        nickname: "string",
      },
    };
    expect(isChangeNickname(invalidTypeValue)).toBeFalsy();
  });

  test("Should return false if invalid type", () => {
    const invalidType = {
      type: 1234,
      timestamp: Date.now(),
      payload: {
        messageId: "string",
        userId: "string",
        nickname: "string",
      },
    };
    expect(isChangeNickname(invalidType)).toBeFalsy();
  });

  test("Should return false if invalid timestamp", () => {
    const invalidTimestamp = {
      type: "changeNickname",
      timestamp: "timestamp",
      payload: {
        messageId: "string",
        userId: "string",
        nickname: "string",
      },
    };
    expect(isChangeNickname(invalidTimestamp)).toBeFalsy();
  });

  test("Should return false if missing timestamp", () => {
    const missingTimestamp = {
      type: "changeNickname",
      payload: {
        messageId: "string",
        userId: "string",
        nickname: "string",
      },
    };
    expect(isChangeNickname(missingTimestamp)).toBeFalsy();
  });

  test("Should return false if missing payload", () => {
    const missingPayload = {
      type: "changeNickname",
      timestamp: Date.now(),
    };
    expect(isChangeNickname(missingPayload)).toBeFalsy();
  });

  test("Should return false if unexpected content in payload", () => {
    const invalidPayload = {
      type: "changeNickname",
      timestamp: Date.now(),
      payload: {
        messageId: "string",
        userId: "string",
        nickname: "string",
        invalid: "",
      },
    };
    expect(isChangeNickname(invalidPayload)).toBeFalsy();
  });

  test("Should return false if invalid messageId", () => {
    const invalidMessageId= {
      type: "changeNickname",
      timestamp: Date.now(),
      payload: {
        messageId: 1234,
        userId: "string",
        nickname: "string",
      },
    };
    expect(isChangeNickname(invalidMessageId)).toBeFalsy()
  });

  test("Should return false if missing messageId",()=>{
        const missingMsgId = {
      type: "changeNickname",
      timestamp:Date.now(),
      payload: {
        userId: "string",
        nickname: "string",
      },
    };
    expect(isChangeNickname(missingMsgId)).toBeFalsy()
  })

  test("Should return false if invalid nickname",()=>{
        const invalidNick = {
      type: "changeNickname",
      timestamp:Date.now(),
      payload: {
        messageId: "string",
        userId: "string",
        nickname: 1234,
      },
    };
    expect(isChangeNickname(invalidNick)).toBeFalsy()
  })

  test("Should return false if missing nickname",()=>{
        const missingNickname = {
      type: "changeNickname",
      timestamp:Date.now(),
      payload: {
        messageId: "string",
        userId: "string",
      },
    };
    expect(isChangeNickname(missingNickname)).toBeFalsy()
  })
});
