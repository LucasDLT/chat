import { WebSocket, WebSocketServer } from "ws";
import type { Server } from "http";
import type {
  ClientToServerMessage,
  ErrorMessage,
  SendMessage,
  ServerToClientMessage,AckMessage
} from "./types/message.t";
import { isSendMessage, isChangeNickname, isRegisterNickname } from "./guards/index";

//funcion que saque de la documentacion en github, para el ping-pong
function heartbeat(this: WebSocket) {
  this.isAlive = true;
}
//set para guardar los id de mensajes y simular una bdd y cache temporal
export const websocketSetup = (server: Server) => {
  const wss = new WebSocketServer({ server });
  const setMessageId = new Set()

  function clearSetIdMsg(){
      setMessageId.clear()
  }
  const clearIntervalIdMsg:NodeJS.Timeout=setInterval(clearSetIdMsg,1000)
  
  wss.on("connection", (ws: WebSocket) => {
    ws.isAlive = true;
    ws.once("message", () => {
      ws.send("conexion ws establecida");
    });

    ws.on("message", (data) => {
      try {
        if (typeof data !== "object") return;
        
        const messageData:ClientToServerMessage = JSON.parse(data.toString())
        
        if(typeof messageData.type !== "string")return
        
        switch (messageData.type) { 
            case "chat.send":
               if (!isSendMessage(messageData))return
               const id = setMessageId.has(messageData.messageId)
               if (id) {
                const msgAck:AckMessage={
                    type:"ack",
                    correlationId:messageData.messageId,
                    timestamp:Date.now(),
                    payload:{
                        status:"error",
                        details:"duplicate"
                    }
                }
                wss.clients.forEach((client)=>{
                    if (client === ws) {
                        client.send(JSON.stringify(msgAck))
                    }
                })
               } 

            }
                



        } catch (error) {

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
  });
};
