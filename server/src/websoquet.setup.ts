import { WebSocket, WebSocketServer } from "ws";
import type { Server } from "http";
import type {
  ClientToServerMessage,
  ErrorMessage,
  AckMessage,
  ChatMessage,
  SystemMessage,
  userData,
  PongServer,
  SnapshotClients,
} from "./types/message.t.js";
import {
  isSendMessage,
  isChangeNickname,
  isRegisterNickname,
} from "./guards/index.js";
import { event_bus } from "./events/events.bus.js";
import { userRepository } from "./config_database/data_source.js";
import { verify_session } from "./utils/verify_session.js";
import { log } from "console";

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
  const registeredClients = new Map<number, userData>(); //map paralelo a clients solo para enviarlo al cliente y tener los conectados

  //para pasar de map a array. No se usa directamente, va dentro de otra fn
  function serializeRegisteredClients() {
    return Array.from(registeredClients.values()).map((u) => ({
      userId: u.userId,
      nickname: u.nickname ?? null,
      isAlive: u.isAlive,
    }));
  }
  //para pasar el userData, pase a JSON y se envie a todos los conectados. No se usa directamente, va dentro de otra fn
  function broadcastRegisteredClients(messageObj: SnapshotClients) {
    const raw = JSON.stringify(messageObj);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(raw);
      }
    });
  }
  //para mandar al socket el resultado de la funcion que cambia map por array, lo pone en el payload. Se usa directamente. Por mas que aun no esta con los datos completos sirve para ver que alguien esta conectado y a la espera de entrar en la sala
  function sendSnapshotToSocket() {
    broadcastRegisteredClients({
      type: "snapshot:clients",
      payload: serializeRegisteredClients(),
      timestamp: Date.now(),
      count: registeredClients.size,
    });
  }
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
  function hasUserId(ws: WebSocket): ws is WebSocket & { userId: number } {
    return typeof ws.userId === "number" && Number.isFinite(ws.userId);
  }
  wss.on("connection", async (ws: WebSocket, request) => {
    //desde aca se comienza a generar el login desde https, y se verificara desde este lado la existencia del token en la cookie, esa verificacion cerrara el socket por cada vez que no la encuentre, dejando pasar al resto de eventos solo cuando la cookie haya sido seteada y hallada en el handshake inicial.
    //IMPORTANTISIMO EN EL CLIENTE VAMOS A TENER QUE LEVANTAR EL PRIMER PEDIDO DE HANDSHAKE LUEGO DEL LOGIN. SI O SI, SINO LA COOKIE NO LLEGA AL PEDIDO QUE HACEMOS ACA.
    console.log("wss iniciado esperando autenticar para inciar chat");
    const token = request.headers.cookie;
    if (!token) {
      console.log("error de autenticacion, socket cerrado");
      ws.close();
      return;
    }
    console.log("autenticacion en proceso");
    const id_user = await verify_session(token);
    const user = await userRepository.findOne({
      where: { id: id_user },
    });
    if (!user) {
      throw new Error("Error de conexion al iniciar el chat");
    }
    console.log("autenticacion finalzada con exito:", user);

    ws.isAlive = true;
    ws.userId = user.id;
    ws.nickname = user.name;

    //mapNicknameId no lo vamos a usar por que permitimos desde ahora nicks duplicados. Por ende esa validacion va a estar de mas al igul que la carga del id del mensaje en ese map. El ack del error y del ok login, creo que va a ser innecesario por que eso lo recibo por http desde el login.

    //objeto para el mapa de clientes que snapshoteamos al cliente para la lista de conectados
    const userData: userData = {
      userId: ws.userId as number,
      isAlive: ws.isAlive,
      nickname: ws.nickname ?? null,
    };

    //ahora si, el system de que ingrese a la sala si debo armarlo y broadcastearlo

    const login_clients: SystemMessage = {
      timestamp: Date.now(),
      type: "system",
      payload: {
        message: `${ws.nickname} ingreso a la sala`,
      },
    };
    const login_client: SystemMessage = {
      timestamp: Date.now(),
      type: "system",
      payload: {
        message: `${ws.nickname} ingresaste a la sala`,
      },
    };

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(login_client));
    }
    wss.clients.forEach((client: WebSocket) => {
      if (ws !== client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(login_clients));
      }
    });
    registeredClients.set(userData.userId, userData);
    sendSnapshotToSocket();

    ws.once("message", () => {
      //aca podria tipar un objeto y hacer el envelope para enviarlo al que se conecta o a todos avisando que se conecto

      ws.send(JSON.stringify("conexion ws establecida"));
    });

    ws.on("message", (data) => {
      try {
        const raw = data instanceof Buffer ? data.toString() : String(data);
        const messageData: ClientToServerMessage = JSON.parse(raw);

        if (typeof messageData.type !== "string") return;

        switch (messageData.type) {
          case "chat.send":
            {
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
                  const toIdMsg =
                    messageData.payload.scope === "chat.public"
                      ? undefined
                      : messageData.payload.toId;

                  const msgClient: ChatMessage = {
                    messageId: messageData.messageId,
                    timestamp: Date.now(),
                    type: messageData.payload.scope,
                    payload: {
                      fromId: ws.userId,
                      toId: toIdMsg,
                      text: messageData.payload.text,
                    },
                  };

                  if (msgClient.type === "chat.public") {
                    wss.clients.forEach((client: WebSocket) => {
                      if (
                        client !== ws &&
                        client.readyState === WebSocket.OPEN
                      ) {
                        client.send(JSON.stringify(msgClient));
                      }
                    });
                  }
                  if (
                    msgClient.type === "chat.private" &&
                    typeof msgClient.payload.toId === "string" &&
                    msgClient.payload.toId
                  ) {
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

            {
              /*  case "registerNickname": {
            //el register se hara directo al inicio del httpserver, este lo voy a quitar directamente
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
                  fromId: ws.userId,
                  nickname: messageData.payload.nickname,
                },
              };
              userData.nickname = messageData.payload.nickname;
              registeredClients.set(userData.userId, userData);
              sendSnapshotToSocket();
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
                  message: `${ws.nickname} ingresaste a la sala`,
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
          }*/
            }

            {
              /*case "changeNickname": {
            //este case es para quitar para ser escuchado en el emit que voy a colocar
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
                  nickname: messageData.payload.nickname,
                  fromId: ws.userId,
                },
              };
              userData.nickname = messageData.payload.nickname;
              registeredClients.set(userData.userId, userData);
              sendSnapshotToSocket();
              const changeNickname: SystemMessage = {
                type: "system",
                timestamp: Date.now(),
                payload: {
                  message: `${oldNick} cambio a ${messageData.payload.nickname}`,
                },
              };
              const msgForClient: SystemMessage = {
                type: "system",
                timestamp: Date.now(),
                payload: {
                  message: `${oldNick} cambiaste a ${messageData.payload.nickname}`,
                },
              };

              wss.clients.forEach((client) => {
                if (client === ws && ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify(msgAckOk));
                  ws.send(JSON.stringify(msgForClient));
                }
                if (client.readyState === WebSocket.OPEN && client !== ws) {
                  client.send(JSON.stringify(changeNickname));
                }
              });
            }
            break;
          }*/
            }
          case "ping.client": {
            const pongServer: PongServer = {
              type: "pong.server",
              timestamp: messageData.timestamp,
            };
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify(pongServer));
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

    //eventos emitidos por mi servidor debo fijarme y quitar del switch los eventos que ahora entran por aca.

    event_bus.on("Change.nickname", async ({ id, new_name }) => {
      //el mapa changeNickname lo vamos a eliminar no lo necesitamos mas
      if (id === ws.userId) {
        const oldNick = ws.nickname;
        ws.nickname = new_name;
        userData.nickname = new_name;
        registeredClients.set(userData.userId, userData);
        sendSnapshotToSocket();

        const changeNickname: SystemMessage = {
          type: "system",
          timestamp: Date.now(),
          payload: {
            message: `${oldNick} cambio a ${ws.nickname}`,
          },
        };
        const msgForClient: SystemMessage = {
          type: "system",
          timestamp: Date.now(),
          payload: {
            message: `${oldNick} cambiaste a ${ws.nickname}`,
          },
        };
        wss.clients.forEach((client) => {
          if (client === ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(msgForClient));
          }
          if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(JSON.stringify(changeNickname));
          }
        });
      }
    });
    
    ws.on("error", (error: Error) => {
      console.log(
        `error de conexion ${error.message}, tipo: ${error.name}, ubucacion-. ${error.stack}`
      );
    });
    ws.on("pong", heartbeat);
    //este evento logout lo creamos en el servicio de logout y solo dispara el evento close que esta debajo.
    event_bus.on("logout", ({ id }) => {
      if (id === ws.userId) {
        ws.close(1000, "logout");
      }
    });
    ws.on("close", () => {
      if (process.env.NODE_ENV !== "test") {
        console.log("conection close socket", ws.nickname);
      }
      if (ws.nickname) {
        const msgForClient: SystemMessage = {
          type: "system",
          timestamp: Date.now(),
          payload: {
            message: `${ws.nickname} get out of the room`,
          },
        };
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(JSON.stringify(msgForClient));
          }
        });
      }
      if (ws.userId) {
        registeredClients.delete(ws.userId);
        sendSnapshotToSocket();
      }
    });
  });

  //continuamos con la funcion del ping-pong. Limpiamos cada 30s de inactividad y verificamos el isAlive como el readyState
  const interval: NodeJS.Timeout = setInterval(function ping() {
    wss.clients.forEach(function each(client: WebSocket) {
      if (client.isAlive === false || client.readyState !== WebSocket.OPEN) {
        if (client.userId) {
          registeredClients.delete(client.userId);
        }
        return client.terminate();
      }
      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on("error", (error) => {
    console.log(
      `error wss. type:${error.name}. ubication:${error.stack}. message:${error.message} `
    );
  });

  wss.on("close", () => {
    if (process.env.NODE_ENV !== "test") {
      console.log("conection close wss");
    }
    clearInterval(interval);
    clearInterval(clearIntervalIdMsg);
    clearInterval(clearIntervalNicks);
    clearInterval(clearIntervalChangeNick);
    mapChangeNicknameId.clear();
    mapMessageId.clear();
    mapNicknameId.clear();
  });

  return {
    wss,
    close: () => {
      clearInterval(interval);
      clearInterval(clearIntervalNicks);
      clearInterval(clearIntervalIdMsg);
      clearInterval(clearIntervalChangeNick);

      mapChangeNicknameId.clear();
      mapMessageId.clear();
      mapNicknameId.clear();

      try {
        wss.close();
      } catch (err) {
        console.log("error close wss:", err);
      }
    },
  };
};
