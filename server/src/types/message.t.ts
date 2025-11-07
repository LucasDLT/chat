export interface BaseMessage{
    type:string
    timestamp:number
}// mensaje base para tipar desde aca que tipo de mensajes tenemos. y 

export interface ChatMessage extends BaseMessage{
    type: "chat.public" | "chat.private";
    messageId:string;
    payload:{
        fromId:string;
        toId:string;
        text:string
    }
}//primer tipo de mensajes que a su vez tiene un subtipo publico y privado. Tiene desde que a que id va el mensaje, y un id unico para identificarlo y evitar duplicados.

export interface SendMessage extends BaseMessage{
    type:"chat.send";
    messageId:string;// este lo tengo que crear desde el cliente con cripto uuid
    payload:{
        toId:string;
        text:string
    }
}

export interface ErrorMessage extends BaseMessage{
    type:"error";
    payload:{
        code:number;
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

export interface SetNickname extends BaseMessage{
    type:"setNickname";
    payload:{
        nickname:string;
        newNickname?:string
    }
}//tipado para el cambio de nickname, viene con el id del usuario para evitar errores y validar, tambien que usuario cambio el nickname y el nuevo nickname.

export interface ChangeNickname extends BaseMessage{
    type:"changeNickname";
    payload:{
        userId:string;
        nickname:string;
    }
}

export interface AckMessage extends BaseMessage{
    type:"ack";
    correlationId:string;// aca iria el id del mensaje que llega en el sendmessage
    payload:{
        status:"ok" | "error"
        details?:string
    }
}//tipado para el ack de los mensajes. el id del mensaje, el status y los detalles si hay errores

export type serverToClientMessage = ChatMessage | ErrorMessage | SystemMessage | AckMessage | ChangeNickname

export type clientToServerMessage = SetNickname | SendMessage 