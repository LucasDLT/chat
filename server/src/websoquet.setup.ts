import { RawData, WebSocket, WebSocketServer } from "ws";
import type { Server } from "http";
import type {
  ClientToServerMessage,
  ErrorMessage,
  SendMessage,
  ServerToClientMessage,
  AckMessage,
  ChatMessage,
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
  const mapMessageId = new Map();
  const setNicknameId = new Set();
  const TLL = 2 * 60 * 1000;

  function clearSetIdMsg() {
    const now = Date.now();
    for (const [id, timestamp] of mapMessageId.entries()) {
      if (now - timestamp > TLL) {
        mapMessageId.delete(id);
      }
    }
  }

  const clearIntervalIdMsg: NodeJS.Timeout = setInterval(
    clearSetIdMsg,
    60 * 1000
  );

  wss.on("connection", (ws: WebSocket) => {
    ws.isAlive = true;
    ws.once("message", () => {
      //aca podria tipar un objeto y hacer el envelope para enviarlo al que se conecta o a todos avisando que se conecto

      ws.send("conexion ws establecida");
    });
    //aca podria hacer otro on message con un mensaje como el de arriba avisando de la conexion a todos y construir el mensaje

    ws.on("message", (data) => {
      try {
        const messageData: ClientToServerMessage = JSON.parse(data.toString());

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

              function hasUerId(
                ws: WebSocket
              ): ws is WebSocket & { userId: string } {
                return typeof ws.userId === "string" && ws.userId.length > 0;
              }
              if (hasUerId(ws)) {
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
            if (setNicknameId.has(messageData.payload.messageId)) {
              const msgAckError: AckMessage = {
                correlationId: messageData.payload.messageId,
                timestamp: Date.now(),
                type: "ack",
                payload: {
                  status: "error",
                  details: "req register nick duplicate, is processing",
                },
              };
              if (ws.readyState === WebSocket.OPEN ) {
              return ws.send(JSON.stringify(msgAckError))
              }
            }else{
              //logica del registro del nuevo nick y envio de mensaje de cambio como sistem a todos los usuarios y uno especial al que lo pidio
            }

            break;
          }
        }
      } catch (error) {
        console.log("Error WSS handler", error);
        try {
          const errorMsg: ErrorMessage = {
            timestamp: Date.now(),
            type: "error",
            payload: {
              code: "500",
              message: "internal websocket server error",
              details: `${ws.nickname} client produce error`,
            },
          };
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
    mapMessageId.clear();
    mapNicknameId.clear();
  });
};
