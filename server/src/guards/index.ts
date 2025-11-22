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
    if (!Number.isFinite(m.timestamp)) return false;

    if (typeof m.payload !== "object" || m.payload === null) return false;

    const payload = m.payload as Record<string, unknown>;
    const msgKeys = Object.keys(m);
    const allowedKeys = ["type", "messageId", "payload", "timestamp"] as const;

    const hasUnexpected = msgKeys.some(
      (key) => !allowedKeys.includes(key as typeof allowedKeys[number])
    );

    if (hasUnexpected) return false;
    const payloadKey = Object.keys(payload);
    const allowedPayloadKeys = ["scope", "toId", "text"] as const;

    const hasUnexpectedPayloadKey = payloadKey.some(
      (key) => !allowedPayloadKeys.includes(key as typeof allowedPayloadKeys[number])
    );

    if (hasUnexpectedPayloadKey) return false;

if (typeof payload.scope !== "string") return false;
  if (payload.scope !== "chat.public" && payload.scope !== "chat.private") return false;

  if (payload.scope === "chat.public") {
    // para public: toId puede faltar (undefined). Solo exigimos text string.
    if (typeof payload.text !== "string") return false;
    return true;
  } else {
    if (typeof payload.toId !== "string" || payload.toId.trim().length === 0) return false;
    if (typeof payload.text !== "string") return false;
    return true;
  }
  }

export function isRegisterNickname(msg: unknown): msg is RegisterNickname {
  const m = msg as Record<string, unknown>;
  if (typeof m !== "object" || m === null) return false;
  if (m.type !== "registerNickname") return false;
  if (typeof m.timestamp !== "number" || m.timestamp === null) return false;
  if (!Number.isFinite(m.timestamp)) return false;

  if (typeof m.payload !== "object") return false;
  const payload = m.payload as Record<string, unknown>;
  const msgKeys = Object.keys(m);
  const allowedKeys = ["type", "payload", "timestamp"] as const;

  const hasUnexpected = msgKeys.some(
    (key) => !allowedKeys.includes(key as typeof allowedKeys[number])
  );

  if (hasUnexpected) return false;
  const payloadKey = Object.keys(payload);
  const allowedPayloadKeys = ["messageId", "nickname"] as const;

  const hasUnexpectedPayloadKey = payloadKey.some(
    (key) => !allowedPayloadKeys.includes(key as typeof allowedPayloadKeys[number])
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
  if (!Number.isFinite(m.timestamp)) return false;

  if (typeof m.payload !== "object" || m.payload === null) return false;
  const payload = m.payload as Record<string, unknown>;
  const msgKeys = Object.keys(m);
  const allowedKeys = ["type", "payload", "timestamp"] as const;

  const hasUnexpected = msgKeys.some(
    (key) => !allowedKeys.includes(key as typeof allowedKeys[number])
  );

  if (hasUnexpected) return false;
  const payloadKey = Object.keys(payload);
  const allowedPayloadKeys = ["messageId", "nickname", "userId"] as const;

  const hasUnexpectedPayloadKey = payloadKey.some(
    (key) => !allowedPayloadKeys.includes(key as typeof allowedPayloadKeys[number])
  );

  if (hasUnexpectedPayloadKey) return false;
  return (
    typeof payload.userId === "string" &&
    typeof payload.nickname === "string" &&
    typeof payload.messageId === "string"
  );
}
