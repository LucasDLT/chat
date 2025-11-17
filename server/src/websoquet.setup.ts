import { RawData, WebSocket, WebSocketServer } from "ws";
import type { Server } from "http";
import type {
  ClientToServerMessage,
  ErrorMessage,
  AckMessage,
  ChatMessage,
  SystemMessage,
} from "./types/message.t";
import {
  isSendMessage,
  isChangeNickname,
  isRegisterNickname,
} from "./guards/index";

//funcion que saque de la documentacion en github, para el ping-pong
function heartbeat(this: WebSocket) {
  this.isAlive = true;
}
//set para guardar los id de mensajes y simular una bdd y cache temporal
export const websocketSetup = (server: Server) => {
  const wss = new WebSocketServer({ server });
  const mapMessageId = new Map<string, number>();
  const mapNicknameId = new Map<string, number>();
  const mapChangeNicknameId = new Map<string, number>();

  const TTL = 2 * 60 * 1000;

  function clearSetIdMsg() {
    const now = Date.now();
    for (const [id, timestamp] of mapMessageId.entries()) {
      if (now - timestamp > TTL) {
        mapMessageId.delete(id);
      }
    }
  }
  function clearSetIdNick() {
    const now = Date.now();
    for (const [id, timeStamp] of mapNicknameId.entries()) {
      if (now - timeStamp > TTL) {
        mapNicknameId.delete(id);
      }
    }
  }
  function clearSetIdChangeNick() {
    const now = Date.now();
    for (const [id, timeStamp] of mapChangeNicknameId.entries()) {
      if (now - timeStamp > TTL) {
        mapChangeNicknameId.delete(id);
      }
    }
  }

  const clearIntervalChangeNick: NodeJS.Timeout = setInterval(
    clearSetIdChangeNick,
    60 * 1000
  );
  const clearIntervalNicks: NodeJS.Timeout = setInterval(
    clearSetIdNick,
    60 * 1000
  );
  const clearIntervalIdMsg: NodeJS.Timeout = setInterval(
    clearSetIdMsg,
    60 * 1000
  );

  //guard para el ID de usuario
  function hasUserId(
    ws: WebSocket
  ): ws is WebSocket & { userId: string } {
    return typeof ws.userId === "string" && ws.userId.length > 0;
  }
  wss.on("connection", (ws: WebSocket) => {
    ws.isAlive = true;


    ws.once("message", () => {
      //aca podria tipar un objeto y hacer el envelope para enviarlo al que se conecta o a todos avisando que se conecto

      ws.send("conexion ws establecida");
    });
    //aca podria hacer otro on message con un mensaje como el de arriba avisando de la conexion a todos y construir el mensaje

    ws.on("message", (data) => {
      try {
        const raw = data instanceof Buffer ? data.toString() : String(data);
        const messageData: ClientToServerMessage = JSON.parse(raw);


        if (typeof messageData.type !== "string") return;

        switch (messageData.type) {
          case "chat.send": {
            if (!isSendMessage(messageData)) return;
            const id = mapMessageId.has(messageData.messageId);
            if (id) {
              const msgAckError: AckMessage = {
                type: "ack",
                correlationId: messageData.messageId,
                timestamp: Date.now(),
                payload: {
                  status: "error",
                  details: "duplicate",
                },
              };
              if (ws.readyState === WebSocket.OPEN) {
                return ws.send(JSON.stringify(msgAckError));
              }
            } else {
              mapMessageId.set(messageData.messageId, Date.now());
              const msgAckOk: AckMessage = {
                type: "ack",
                correlationId: messageData.messageId,
                timestamp: Date.now(),
                payload: {
                  status: "ok",
                  details: "message sent",
                },
              };
              if (ws.readyState === WebSocket.OPEN)
                ws.send(JSON.stringify(msgAckOk));

              if (hasUserId(ws)) {
                const msgClient: ChatMessage = {
                  messageId: messageData.messageId,
                  timestamp: Date.now(),
                  type: messageData.payload.scope,
                  payload: {
                    fromId: ws.userId,
                    toId: messageData.payload.toId,
                    text: messageData.payload.text,
                  },
                };
                if (msgClient.type === "chat.public") {
                  wss.clients.forEach((client: WebSocket) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                      client.send(JSON.stringify(msgClient));
                    }
                  });
                }
                if (msgClient.type === "chat.private") {
                  wss.clients.forEach((client: WebSocket) => {
                    if (
                      client.readyState === WebSocket.OPEN &&
                      client !== ws &&
                      client.userId === msgClient.payload.toId
                    ) {
                      client.send(JSON.stringify(msgClient));
                    }
                  });
                }
              }
            }
            break;
          }

          case "registerNickname": {
            if (!isRegisterNickname(messageData)) return;
            if (mapNicknameId.has(messageData.payload.messageId)) {
              const msgAckError: AckMessage = {
                correlationId: messageData.payload.messageId,
                timestamp: Date.now(),
                type: "ack",
                payload: {
                  status: "error",
                  details: "req register nick duplicate, is processing",
                },
              };
              if (ws.readyState === WebSocket.OPEN) {
                return ws.send(JSON.stringify(msgAckError));
              }
            } else {
              mapNicknameId.set(messageData.payload.messageId, Date.now());
              const msgAckOk: AckMessage = {
                correlationId: messageData.payload.messageId,
                timestamp: Date.now(),
                type: "ack",
                payload: {
                  status: "ok",
                  details: "register nick ok",
                },
              };
              ws.nickname = messageData.payload.nickname;
              const registerNicknamePublic: SystemMessage = {
                type: "system",
                timestamp: Date.now(),
                payload: {
                  message: `${ws.nickname} ingreso a la sala`,
                },
              };
              const registerNicknamePrivate: SystemMessage = {
                type: "system",
                timestamp: Date.now(),
                payload: {
                  message: `${ws.nickname} ingresaste a la sala`
                },
              };
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(msgAckOk));
                ws.send(JSON.stringify(registerNicknamePrivate));
              }
              wss.clients.forEach((client: WebSocket) => {
                if (ws !== client && client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify(registerNicknamePublic));
                }
              });
            }
            break;
          }

          case "changeNickname": {
            if (!isChangeNickname(messageData)) return;

            if (mapChangeNicknameId.has(messageData.payload.messageId)) {
              const msgAckError: AckMessage = {
                type: "ack",
                timestamp: Date.now(),
                correlationId: messageData.payload.messageId,
                payload: {
                  status: "error",
                  details: "duplicate request - changeNickname in progress",
                },
              };
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(msgAckError));
              }
              return;
            } else {
              mapChangeNicknameId.set(
                messageData.payload.messageId,
                Date.now()
              );
              const oldNick = ws.nickname ?? "unknown";
              ws.nickname = messageData.payload.nickname;
              const msgAckOk: AckMessage = {
                correlationId: messageData.payload.messageId,
                timestamp: Date.now(),
                type: "ack",
                payload: {
                  status: "ok",
                  details: "change nick ok",
                },
              };
              const changeNickname: SystemMessage = {
                type: "system",
                timestamp: Date.now(),
                payload: {
                  message: `${oldNick} cambio a ${messageData.payload.nickname}`,
                },
              };

              wss.clients.forEach((client) => {
                if (client === ws && ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify(msgAckOk));
                }
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify(changeNickname));
                }
              });
            }
            break;
          }
        }
      } catch (error) {
        console.log("Error WSS handler", error);
        const errorMsg: ErrorMessage = {
          timestamp: Date.now(),
          type: "error",
          payload: {
            code: "500",
            message: "internal websocket server error",
            details: `${ws.nickname} client produce error`,
          },
        };
        try {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(errorMsg));
          }
        } catch (sendErr) {
          console.error("Failed to send error message to client:", sendErr);
        }
      }
    });

    ws.on("error", (error: Error) => {
      console.log(
        `error de conexion ${error.message}, tipo: ${error.name}, ubucacion-. ${error.stack}`
      );
    });
    ws.on("pong", heartbeat);

    ws.on("close", () => {
      console.log("conexion finalizada");
    });
  });

  //continuamos con la funcion del ping-pong. Limpiamos cada 30s de inactividad y verificamos el isAlive como el readyState
  const interval: NodeJS.Timeout = setInterval(function ping() {
    wss.clients.forEach(function each(client: WebSocket) {
      if (client.isAlive === false) return client.terminate();
      if (client.readyState !== WebSocket.OPEN) return client.terminate();

      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  //aca dejamos errores y cierre del servidor websocket, sin ws ya que para esta altura no deberian quedar conexiones activas
  wss.on("error", (error) => {
    console.log(
      `error en wss. tipo:${error.name}. ubicacion:${error.stack}. mensaje:${error.message} `
    );
  });

  wss.on("close", () => {
    console.log("close del wss");
    clearInterval(interval);
    clearInterval(clearIntervalIdMsg);
    clearInterval(clearIntervalNicks);
    clearInterval(clearIntervalChangeNick);
    mapChangeNicknameId.clear();
    mapMessageId.clear();
    mapNicknameId.clear();
  });

  return{
    wss,
    close:()=>{
      clearInterval(interval)
      clearInterval(clearIntervalNicks)
      clearInterval(clearIntervalIdMsg)
      clearInterval(clearIntervalChangeNick)

      mapChangeNicknameId.clear()
      mapMessageId.clear()
      mapNicknameId.clear()

      try {
        wss.close()
      } catch(err){
        console.log("error closing wss:", err);
        
      }
    }
  }
};
