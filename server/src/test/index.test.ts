import { describe, expect, test } from "@jest/globals";
import { isSendMessage } from "../guards";

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
      timestamp:Date.now(),
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
      timestamp:Date.now(),
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
      timestamp:Date.now(),
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
      timestamp:Date.now(),
      messageId: "msg-id",
    };
    expect(isSendMessage(missingPayload)).toBe(false);
  });

  test("Should return false if type missing", () => {
    const missingType = {
      messageId: "msg-id",
      timestamp:Date.now(),
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
      timestamp:Date.now(),
      payload: {
        scope: "chat.public",
        toId: "toid",
        text: 12345,
      },
    };
    expect(isSendMessage(invalidText)).toBe(false);
  });

  test("Should return false if missing date",()=>{
     const invalidText = {
      type: "chat.send",
      messageId: "msg-id",      
      payload: {
        scope: "chat.public",
        toId: "toid",
        text: "missing date",
      },
    };
    expect(isSendMessage(invalidText)).toBe(false)
  })
});
