export interface BaseMessage{
    timestamp:number
}// mensaje base para tipar desde aca que tipo de mensajes tenemos. y la hora

export interface ChatMessage extends BaseMessage{
    type: "chat.public" | "chat.private"; 
    messageId:string;
    payload:{
        fromId:string;
        toId?:string | undefined; 
        text:string
    }
}//primer tipo de mensajes que a su vez tiene un subtipo publico y privado. Tiene desde que a que id va el mensaje, y un id unico para identificarlo y evitar duplicados.

export interface SendMessage extends BaseMessage{
    type:"chat.send";
    messageId:string;// este lo tengo que crear desde el cliente con cripto uuid, es decir viene desde el frontend
    payload:{
        scope:"chat.public" | "chat.private";
        toId?:string;
        text:string
    }
}// tipo de mensaje para el envio de mensajes, viene con el id del destinatario y el texto, proviene desde el cliente pasa por el server y luego lo pasamos en el broadcast



export interface ErrorMessage extends BaseMessage{
    type:"error";
    payload:{
        code:string;
        message:string;
        details?:string
    }
}//tipado basico para mensaje de error luego desestrucuraremos para hacer el envelope del msg diciendo que es un error, el numero del codigo y detalles si hay.

export interface SystemMessage extends BaseMessage{
    type:"system";
    payload:{
        message:string
    }
}//de momento este tipado lo dejamos para los mensajes del sistema, como conectado, desconectado etc.

export interface RegisterNickname extends BaseMessage{
    type:"registerNickname";
    payload:{ 
        messageId:string;
        nickname:string;
    }
}//tipado para el cambio de nickname, viene con el id del usuario para evitar errores y validar, tambien que usuario cambio el nickname y el nuevo nickname.


export interface ChangeNickname extends BaseMessage{
    type:"changeNickname";
    payload:{
        messageId:string;
        userId:string;
        nickname:string;
    }
}





export interface AckMessage extends BaseMessage{
    type:"ack";
    correlationId:string;// aca iria el id del mensaje que llega en el sendmessage
    payload:{
        status:"ok" | "error",
        details?:string,
        fromId?:string | undefined
    }
}//tipado para el ack de los mensajes. el id del mensaje, el status y los detalles si hay errores


//uniones de tipos para que el switch me tome varios tipos desde una sola interface
export type ServerToClientMessage = ChatMessage | ErrorMessage | SystemMessage | AckMessage 

export type ClientToServerMessage = RegisterNickname | SendMessage | ChangeNickname