import {
  ChatMessage,
  ClientsConected,
  DispatchContext,
  FeedMessage,
  PrivateMessage,
  PublicMessage,
  ServerToClientMessage,
  SnapshotClients,
  SystemMessage,
} from "@/types/types";

export const handle_resolve_snapshot = (
  msg: SnapshotClients,
): ClientsConected[] => {
  if (msg.type !== "snapshot:clients") {
    throw new Error("error de actualizacion de clientes");
  }
  const conected_nicks: ClientsConected[] = [];
  for (const c of msg.payload) {
    conected_nicks.push({
      userId: c.userId,
      nick: c.nickname,
    });
  }
  return conected_nicks;
};

//handle_resolve_snapshot: recibe msg (informacion que llega desde el servidor) y un map (listado de nicks e ids). Se crea un array tipado como ClientsConected iniciado como array vacio. Y con un for, recorremos el payload del msg recibido, que es un array de usuarios. En cada iteracion se agrega un par clave valor al map siendo esto un usuarioId y su nick. Luego se agrega a la lista de conected_nicks un objeto con userId y nick.

export const handle_normalize_msg = (msg: ChatMessage): FeedMessage => {
  return {
    id: msg.messageId,
    scope: msg.type === "chat.private" ? "private" : "public",
    text: msg.payload.text,
    timestamp: Date.parse(msg.timestamp),
    fromId: msg.payload.fromId,
    toId: msg.payload.toId,
    kind: "user",
  };
};
//handle_normalize_msg: recibe msg (informacion que llega desde el servidor) y se transforma en un objeto FeedMessage.

export const handle_normalize_system_msg = (
  msg: SystemMessage,
): FeedMessage => {
  return {
    id: crypto.randomUUID(),
    timestamp: Date.parse(msg.timestamp),
    text: msg.payload.message,
    scope: msg.type,
    kind: "system",
  };
};
//handle_normalize_msg: recibe msg (informacion que llega desde el servidor) y se transforma en un objeto FeedMessage.

export const dispatcher_ws_event = (
  msg: ServerToClientMessage,
  controller: DispatchContext,
  socket: WebSocket,
) => {
  switch (msg.type) {
    case "chat.public":
    case "chat.private":
      controller.addMessage(handle_normalize_msg(msg));
      break;
    case "system":
      controller.addMessageSystem(handle_normalize_system_msg(msg));
      break;
    case "snapshot:clients":
      const clients = handle_resolve_snapshot(msg);
      controller.setClients(clients);
      break;
    case "ack.handshake":
      controller.handleAck(msg, socket);
      break;
  }
};

//handles para normalizacion de mensajes entrantes desde la BDD

export const normalize_msg_private= (msg: PrivateMessage[]): FeedMessage[] => {
  return msg.map(c=>({
    id:c.id,
    kind:"user",
    scope:"private",
    text:c.text,
    timestamp: new Date(c.craetedAt).getTime(),
    fromId:c.sender.id,
    fromNick:c.sender.name,
    toId:c.receiver?.id
    }))  
};

export const normalize_msg_public= (msg: PublicMessage[]): FeedMessage[] => {
  return msg.map(c=>({
    id:c.id,
    kind:"user",
    scope:"public",
    text:c.text,
    timestamp:c.craetedAt.getTime(),
    fromId:c.sender.id,
    fromNick:c.sender.name,
    }))  
};

