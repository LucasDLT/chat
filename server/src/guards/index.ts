import type {
  ChangeNickname,
  RegisterNickname,
  SendMessage,
} from "../types/message.t.js";

export function isSendMessage(msg: unknown): msg is SendMessage {
  if (typeof msg !== "object" || msg === null) return false;
  const m = msg as Record<string, unknown>;
  if (typeof m.type !== "string" || m.type !== "chat.send") return false;
  if (typeof m.messageId !== "string" || m.messageId === null) return false;
  if (typeof m.timestamp !== "number" || m.timestamp === null) return false;
  if (typeof m.payload !== "object" || m.payload === null) return false;
  const payload = m.payload as Record<string, unknown>;
  return (typeof payload.toId === "string" && typeof payload.text === "string" && typeof payload.scope === "string");
}

export function isRegisterNickname(msg: unknown): msg is RegisterNickname {
  if (typeof msg !== "object" || msg === null) return false;
  const m = msg as Record<string, unknown>;
  if (m.type !== "registerNickname") return false;
  if (typeof m.timestamp !== "number" || m.timestamp === null) return false;
  if (typeof m.payload !== "object") return false;
  const payload = m.payload as Record<string, unknown>;
  return (typeof payload.nickname === "string" && typeof payload.messageId === "string")
}

export function isChangeNickname(msg: unknown): msg is ChangeNickname {
  if (typeof msg !== "object" || msg === null) return false;
  const m = msg as Record<string, unknown>;
  if (m.type !== "changeNickname") return false;
  if (typeof m.timestamp !== "number" || m.timestamp === null) return false;
  if (typeof m.payload !== "object" || m.payload === null) return false;
  const payload = m.payload as Record<string, unknown>;
  return (
    typeof payload.userId === "string" && typeof payload.nickname === "string" && typeof payload.messageId === "string"
  );
}
