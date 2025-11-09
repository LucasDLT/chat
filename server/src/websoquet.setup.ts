import {WebSocket, WebSocketServer } from 'ws';
import type { Server } from 'http';
import type { ClientToServerMessage, ErrorMessage, ServerToClientMessage } from './types/message.t';



export const websocketSetup = (server: Server) => {
    const wss = new WebSocketServer({server});
    
    
    wss.on("connection", (ws:WebSocket)=>{

    })

    //aca dejamos errores y cierre del servidor websocket, sin ws ya que para esta altura no deberian quedar conexiones activas
    wss.on("error", (error)=>{
        console.log(`error en wss. tipo:${error.name}. ubicacion:${error.stack}. mensaje:${error.message} `)
    })

    wss.on("close",()=>{
        console.log("close del wss");
    })
}