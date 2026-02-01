/********************************************************TIPADOS PARA EVENTOS DE SOCKETS***********************************************************/
export interface BaseMessage {
  timestamp: number;
} 

export interface ChatMessage extends BaseMessage {
  type: "chat.public" | "chat.private";
  messageId: string;
  payload: {
    fromId: number;
    toId?: number | undefined;
    text: string;
  };
} 
export interface SendMessage extends BaseMessage {
  type: "chat.send";
  messageId: string; 
    payload: {
    scope: "chat.public" | "chat.private";
    toId?: number;
    text: string;
  };
} 
export interface ErrorMessage extends BaseMessage {
  type: "error";
  payload: {
    code: string;
    message: string;
    details?: string;
  };
} 
export interface SystemMessage extends BaseMessage {
  timestamp: number;
  type: "system";
  payload: {
    message: string;
  };
} 

{/*export interface ChangeNickname extends BaseMessage {
  type: "changeNickname";
  payload: {
    messageId: string;
    userId: number;
    nickname: string;
  };
}*/}

export interface PongServer extends BaseMessage {
  type: "pong.server";
}

export interface PingClient extends BaseMessage {
  type: "ping.client";
}

export interface AckMessage extends BaseMessage {
  type: "ack";
  correlationId: string; 
  payload: {
    status: "ok" | "error";
    details?: string;
    fromId?:  number | undefined;
    nickname?: string;
  };
} 

export interface SnapshotClients {
  type: "snapshot:clients";
  payload: userData[];
  timestamp: number;
  count: number;
}



/**************************************************************************************************************************************************/

export interface userData {
  userId: number;
  nickname: string;
  isAlive?: boolean;
}
export interface ProcessMsg {
  message?: {
    type: "chat.public" | "chat.private";
    text: string;
    toId?: number;
    fromId?: number;
    messageId: string;
    timestamp: number;
  };
  clients?: ClientsConected[];
  count?: number;
  systemMessage?: SystemMessage;
}

export interface ClientsConected {
  messageIn?: boolean;
  totalMessageIn?: number;
  msgPriv?: MsgInFeed[];
  userId: number;
  nick: string;
}
/***************************************************DESCRIMINATED UNIONS DE SOCKETS EVENTS*********************************************************/
export type ServerToClientMessage =
  | ChatMessage
  | ErrorMessage
  | SystemMessage
  | AckMessage
  | PongServer
  | SnapshotClients;

export type ClientToServerMessage =
  //| Register
  | SendMessage
  //| ChangeNickname
  | PingClient;



/***************************************************TIPADO NORMALIZADOR DE MESSAGES PARA FEED******************************************************/

export interface MsgInFeed {
  fromId?: number;
  msg: string;
  messageId: string;
  timestamp: number;
  type: "user" | "system";
  fromNick?: string;
  privateId?: number;
}



//**************************************************NUEVOS TIPADOS************************************************************/

//TIPADOS PARA FORMULARIOS REFACTORIZADOS
export interface User {
  id: number;
  email: string;
  name: string;
  provider: AuthProvider;
}

export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
}

export interface Register {
  name: string;
  email: string;
  password: string;
} 
export interface Login {
  email: string;
  password: string;
} 
export interface FormsErrors {
  name?:string;
  email: string;
  password: string;
} 

export interface ModalProps {
  message: string;
}

//enum para el container de formularios

export enum forms {
  login = "login",
  register = "register",
}

//Tipos para retornos de messages DTOS server to client

export interface PublicMessage {
  id: number;
  text: string;
  craetedAt: Date;
  sender: PublicUser;
}
export interface PublicUser {
  id: number;
  name: string;
}


export interface PrivateMessage {
  id:number, 
  text:string,
  craetedAt:Date,
  sender:PrivateUser,
  receiver:PrivateUser | null
}
interface PrivateUser {
  id: number;
  name: string;
}