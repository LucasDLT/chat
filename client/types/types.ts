/********************************************************TIPADOS PARA EVENTOS DE SOCKETS***********************************************************/
export interface BaseMessage {
  timestamp: string;
}

export interface ChatMessage extends BaseMessage {
  type: "chat.public" | "chat.private";
  messageId: number;
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
  type: "system";
  payload: {
    message: string;
  };
}

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
    fromId?: number | undefined;
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

export interface ClientsConected {
  userId: number;
  nick: string;
}
/***************************************************DESCRIMINATED UNIONS DE SOCKETS EVENTS*********************************************************/
export type ServerToClientMessage =
  | ChatMessage
  | ErrorMessage
  | SystemMessage
  | AckHandshake
  | PongServer
  | SnapshotClients;

export type ClientToServerMessage =
  //| Register
  | SendMessage
  //| ChangeNickname
  | PingClient;

/***************************************************TIPADO NORMALIZADOR DE MESSAGES PARA FEED******************************************************/

type FeedScope = "public" | "private" | "system";

export interface FeedMessage {
  id: string | number;
  scope: FeedScope;
  kind: "user" | "system";

  text: string;
  timestamp: number;

  fromId?: number;
  fromNick?: string;
  toId?: number;
}

export interface SystemFeedMessage {
  id: string;
  scope: "system";
  timestamp: number;
  message: string;
}

/***************************************************TIPADO PARA EL CONTROLLER DEL CTX*******************/

export interface DispatchContext {
  addMessage(message: FeedMessage): void;
  addMessageSystem(message: FeedMessage): void;
  setClients(message: ClientsConected[]): void;
  handleAck(message: AckHandshake, socket: WebSocket): void;
}

export interface AckHandshake extends BaseMessage{
    type:"ack.handshake";
    payload:{
        status:"ok" | "error",
        id:number,
        nickname:string
    }
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
  name?: string;
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
  id: number;
  text: string;
  craetedAt: Date;
  sender: PrivateUser;
  receiver: PrivateUser | null;
}
interface PrivateUser {
  id: number;
  name: string;
}

/****************************TIPADO PARA EL STORE DEL USER*******************************/

interface MessagesStore {
  byId: Record<string, FeedMessage>; //estructura record para mensajes se convierte en array antes del render
  order: string[]; //aca vamos almacenar los ids entrantes previo dedupe
  view: {
    //control de busqueda local de mensajes en store
    offset: number;
    limit: number;
    currentMsgId?: string;
  };
  remote: {
    //control de busqueda en bdd
    offset: number;
    limit: number;
    hasMore: boolean;
    loading: boolean;
  };
}

interface UserInboxMeta {
  unreadCount: number;
  hasNewMessages: boolean;
  lastMessageTimestamp?: number;
}

interface PublicInboxMeta {
  unreadCount: number;
  hasNewMessages: boolean;
}
//por ultimo hacemos este appstore lleva dentro los datos privados del usuario y el store tipado. Todo centralizado desde aca.
export interface AppStore {
  userData: userData;
  store: MessagesStore;
  inboxMeta: Record<string, UserInboxMeta>;
  publicMeta: PublicInboxMeta;
  clients: ClientsConected[];
}

//INITIAL STATE

export const INITIAL_STATE: AppStore = {
  userData: {
    userId: 0,
    nickname: "",
    isAlive: false,
  },
  store: {
    byId: {},
    order: [],
    view: {
      offset: 0,
      limit: 30,
    },
    remote: {
      offset: 0,
      limit: 30,
      hasMore: true,
      loading: false,
    },
  },
  inboxMeta: {},
  publicMeta: {
    unreadCount: 0,
    hasNewMessages: false,
  },
  clients: [],
};

//IDEA: HACER UN TIPADO PARA UN ESTADO QUE SEA LA BUSQUEDA, QUE CONTENGA LOS 5 ESTADOS QUE MANEJO HOY PERO EN FORMA DE PROPIEDADES.
