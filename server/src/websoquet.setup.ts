import {WebSocket, WebSocketServer } from 'ws';
import type { Server } from 'http';
import type { ClientToServerMessage, ErrorMessage, ServerToClientMessage } from './types/message.t';


//funcion que saque de la documentacion en github, para el ping-pong
function heartbeat(this:WebSocket){
    this.isAlive=true
}
export const websocketSetup = (server: Server) => {
    const wss = new WebSocketServer({server});
    
    
    wss.on("connection", (ws:WebSocket)=>{
        ws.isAlive=true
        
        ws.on("error", (error:Error)=>{
            console.log(`error de conexion ${error.message}, tipo: ${error.name}, ubucacion-. ${error.stack}`)
        })
        ws.on("pong", heartbeat)
    })
    //continuamos con la funcion del ping-pong. Limpiamos cada 30s de inactividad y verificamos el isAlive como el readyState
    const interval:NodeJS.Timeout = setInterval(function ping(){
    wss.clients.forEach( function each(client:WebSocket){
            if (client.isAlive===false ) return client.terminate()
            if (client.readyState !== WebSocket.OPEN) return client.terminate()
        
            client.isAlive=false
            client.ping()
        })
    },30000)

    //aca dejamos errores y cierre del servidor websocket, sin ws ya que para esta altura no deberian quedar conexiones activas
    wss.on("error", (error)=>{
        console.log(`error en wss. tipo:${error.name}. ubicacion:${error.stack}. mensaje:${error.message} `)
    })

    wss.on("close",()=>{
        console.log("close del wss");
        clearInterval(interval)
    })
}