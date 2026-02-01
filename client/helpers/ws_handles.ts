import { AckMessage, ClientsConected, SnapshotClients } from "@/types/types";


export const handle_ack_init = (msg:AckMessage, socket:WebSocket)=>{
if (msg.type !== "ack" || msg.payload.status === "error") {
    throw new Error ("error de verificacion")
}
if (msg.payload.status === "ok") {
    socket.isAlive=true
    socket.nickname = msg.payload.nickname
    socket.userId = msg.payload.fromId
}
}

//handle_ack_init: recibe msg y socket, representan el mensaje recibido por el socket y el cliente mismo. Luego de las verificaciones pertinentes para evitar filtrar errores a otra capa, se mutan las propiedades del socket para que el mismo ahora posea nick, id y su boolean en true. 


export const handle_resolve_snapshot = (msg:SnapshotClients, map:Record<number, string> ):ClientsConected[]=>{
    if(msg.type !== "snapshot:clients"){
        throw new Error ("error de actualizacion de clientes")
    }
    const conected_nicks:ClientsConected[]=[]
    for(const c of msg.payload){
        map[c.userId]=c.nickname;
        conected_nicks.push({
            userId:c.userId,
            nick:c.nickname
        })
    }
    return conected_nicks
}

