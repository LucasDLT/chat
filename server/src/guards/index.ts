import type {
  ChangeNickname,
  RegisterNickname,
  SendMessage,
} from "../types/message.t.js";

export function isSendMessage(msg: unknown): msg is SendMessage {
  const m = msg as Record<string, unknown>;
  if (typeof m !== "object" || m === null) return false;
  if (typeof m.type !== "string" || m.type !== "chat.send") return false;
  if (typeof m.messageId !== "string" || m.messageId === null) return false;
  if (typeof m.timestamp !== "number" || m.timestamp === null) return false;
  if (typeof m.payload !== "object" || m.payload === null) return false;

  const payload = m.payload as Record<string, unknown>;
  const msgKeys = Object.keys(m);
  const allowedKeys = ["type", "messageId", "payload", "timestamp"];

  const hasUnexpected = msgKeys.some(
    (key) => !allowedKeys.includes(key as any)
  );

  if (hasUnexpected) return false;
  const PayloadKey = Object.keys(payload);
  const allowedPayloadKeys = ["scope", "toId", "text"];

  const hasUnexpectedPayloadKey = PayloadKey.some(
    (key) => !allowedPayloadKeys.includes(key as any)
  );

  if (hasUnexpectedPayloadKey) return false;

  return (
    typeof payload.toId === "string" &&
    typeof payload.text === "string" &&
    typeof payload.scope === "string" &&
    (payload.scope === "chat.public" || payload.scope === "chat.private")
  );
}

export function isRegisterNickname(msg: unknown): msg is RegisterNickname {
  const m = msg as Record<string, unknown>;
  if (typeof m !== "object" || m === null) return false;
  if (m.type !== "registerNickname") return false;
  if (typeof m.timestamp !== "number" || m.timestamp === null) return false;
  if (typeof m.payload !== "object") return false;
  const payload = m.payload as Record<string, unknown>;
  const msgKeys = Object.keys(m);
  const allowedKeys = ["type", "payload", "timestamp"];

  const hasUnexpected = msgKeys.some(
    (key) => !allowedKeys.includes(key as any)
  );

  if (hasUnexpected) return false;
  const PayloadKey = Object.keys(payload);
  const allowedPayloadKeys = ["messageId", "nickname"];

  const hasUnexpectedPayloadKey = PayloadKey.some(
    (key) => !allowedPayloadKeys.includes(key as any)
  );

  if (hasUnexpectedPayloadKey) return false;

  return (
    typeof payload.nickname === "string" &&
    typeof payload.messageId === "string"
  );
}

export function isChangeNickname(msg: unknown): msg is ChangeNickname {
  const m = msg as Record<string, unknown>;
  if (typeof msg !== "object" || msg === null) return false;
  if (m.type !== "changeNickname") return false;
  if (typeof m.timestamp !== "number" || m.timestamp === null) return false;
  if (typeof m.payload !== "object" || m.payload === null) return false;
  const payload = m.payload as Record<string, unknown>;
  const msgKeys = Object.keys(m);
  const allowedKeys = ["type", "payload", "timestamp"];

  const hasUnexpected = msgKeys.some(
    (key) => !allowedKeys.includes(key as any)
  );

  if (hasUnexpected) return false;
  const PayloadKey = Object.keys(payload);
  const allowedPayloadKeys = ["messageId", "nickname", "userId"];

  const hasUnexpectedPayloadKey = PayloadKey.some(
    (key) => !allowedPayloadKeys.includes(key as any)
  );

  if (hasUnexpectedPayloadKey) return false;
  return (
    typeof payload.userId === "string" &&
    typeof payload.nickname === "string" &&
    typeof payload.messageId === "string"
  );
}
