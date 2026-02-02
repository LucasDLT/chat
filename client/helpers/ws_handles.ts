import {
  AckMessage,
  ChatMessage,
  ClientsConected,
  DispatchContext,
  FeedMessage,
  ServerToClientMessage,
  SnapshotClients,
  SystemFeedMessage,
  SystemMessage,
} from "@/types/types";

export const handle_ack_init = (msg: AckMessage, socket: WebSocket) => {
  if (msg.type !== "ack" || msg.payload.status === "error") {
    throw new Error("error de verificacion");
  }
  if (msg.payload.status === "ok") {
    socket.isAlive = true;
    socket.nickname = msg.payload.nickname;
    socket.userId = msg.payload.fromId;
  }
};

//handle_ack_init: recibe msg y socket, representan el mensaje recibido por el socket y el cliente mismo. Luego de las verificaciones pertinentes para evitar filtrar errores a otra capa, se mutan las propiedades del socket para que el mismo ahora posea nick, id y su boolean en true. Por nuevo modelo ahora quitamos el map diretamente le sacamos esa responsabilidad al handle y dejamos solo el return del array

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
        kind:"user"
    };
};
//handle_normalize_msg: recibe msg (informacion que llega desde el servidor) y se transforma en un objeto FeedMessage.


export const handle_normalize_system_msg=(msg:SystemMessage):FeedMessage=>{
    return {
        id:crypto.randomUUID(),
        timestamp:Date.parse(msg.timestamp),
        text:msg.payload.message,
        scope:msg.type,
        kind:"system",
    }
}
//handle_normalize_msg: recibe msg (informacion que llega desde el servidor) y se transforma en un objeto FeedMessage.


export const dispatcher_ws_event =(msg:ServerToClientMessage, controller:DispatchContext)=>{
switch (msg.type) {
    case "chat.public":
    case "chat.private":
        controller.addMessage(handle_normalize_msg(msg));
        break;
    case "system":
        controller.addMessageSystem(handle_normalize_system_msg(msg));
        break;
    case "snapshot:clients":
        controller.setClients(handle_resolve_snapshot(msg));
        break;
    case "ack":
        controller.handleAck(msg.payload.fromId!, msg.payload.nickname!);
        break;
}
}

