"use client";
import React, {
  useState,
  createContext,
  ReactNode,
  useEffect,
  useRef,
  useContext,
  FormEvent,
  ChangeEvent,
  useMemo,
  use,
} from "react";
import { cleanIntervals, startHeartbeat } from "@/helpers/sockets_fn";
import {
  ClientsConected,
  PublicMessage,
  PrivateMessage,
  SendMessage,
  ServerToClientMessage,
  User,
  DispatchContext,
  AppStore,
  INITIAL_STATE,
} from "@/types/types";
import { nanoid } from "nanoid";
import { resolve_private_messages } from "@/helpers/messages/private_msg";
import { resolve_public_messages } from "@/helpers/messages/public_msg";
import { resolve_search_public_messages } from "@/helpers/messages/search_public_msg";
import { resolve_search_private_messages } from "@/helpers/messages/search_private_msg";
import {
  dispatcher_ws_event,
  normalize_msg_private,
  normalize_msg_public,
} from "@/helpers/sockets_fn/ws_handles";
import {
  updateDataSnapshot,
  updateDataUser,
  uptadeInboxSystem,
  uptadeInboxPrivate,
  uptadeInboxPublic,
  handleUpdatePrivateData,
  handleUpdateSearchMsgPriv,
  handleUpdateSearchMsgPublic,
  handleNewFeedPublic,
  handleNewFeedPrivate,
} from "@/helpers/app_store/app_store_actions";

interface IcontextProps {
  //interface para las variables, setters o handlers que pase por contexto a la app
  socketRef: React.RefObject<WebSocket | null>;
  hasNickname: boolean;
  setHasNickname: React.Dispatch<React.SetStateAction<boolean>>;

  privateIdMsg: number | undefined;
  setPrivateIdMsg: React.Dispatch<React.SetStateAction<number | undefined>>;
  clientSelected: string | undefined;
  setClientSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSelectClient: (userId: number, nick: string) => void;
  handleActiveUser: () => void;
  activeUser: boolean;
  setActiveUser: React.Dispatch<React.SetStateAction<boolean>>;
  inputMsg: string | undefined;
  setInputMsg: React.Dispatch<React.SetStateAction<string | undefined>>;
  sendMessagePrivate: (e: React.FormEvent<HTMLFormElement>) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  changeInputMessage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  returnToGroup: () => void;
  activeFeed: boolean;
  setActiveFeed: React.Dispatch<React.SetStateAction<boolean>>;
  inputMsgSearch: string | undefined;
  setInputMsgSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSearchMsg: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeSearchMsgFeed: (e: ChangeEvent<HTMLInputElement>) => void;

  messageRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  inputSearch: string;
  setInputSearch: React.Dispatch<React.SetStateAction<string>>;

  //estados compartidos en refactor
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  appStore: AppStore;
  setAppStore: React.Dispatch<React.SetStateAction<AppStore>>;
}

interface ContextProviderProps {
  //interface para saber que va a ser el children del contexto
  children: ReactNode;
}

//en este proyecto vamos a implementar el inicio del contexto de esta forma con los tipos o null
export const ContextApp = createContext<IcontextProps | undefined>(undefined);

export function useAppContextWs(): IcontextProps {
  const contextWs = useContext(ContextApp);
  if (!contextWs) {
    throw new Error(
      "Error al intentar ingresar al contexto, en este momento en null o estas intentando accerder fuera del dominio de su provider",
    );
  }
  return contextWs;
}

export const ContextWebSocket = ({ children }: ContextProviderProps) => {
  const port = process.env.NEXT_PUBLIC_WS_PORT;
  const socketRef = useRef<WebSocket | null>(null);

  const [hasNickname, setHasNickname] = useState<boolean>(false);
  const [privateIdMsg, setPrivateIdMsg] = useState<number | undefined>(
    undefined,
  );
  const [clientSelected, setClientSelected] = useState<string | undefined>(
    undefined,
  );

  const [inputMsg, setInputMsg] = useState<string | undefined>(undefined);
  const [activeUser, setActiveUser] = useState<boolean>(false);
  const [activeFeed, setActiveFeed] = useState<boolean>(false);
  const [inputMsgSearch, setInputMsgSearch] = useState<string | undefined>(
    undefined,
  );
  //const [resMsgSearch, setResMsgSearch] = useState<MsgInFeed[] | []>([]);
  const [inputSearch, setInputSearch] = useState<string>("");

  //referencia para el scroll automatico al mensaje filtrado activo
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  //referencia para el scroll automatico al mensaje nuevo ingresado al feed

  //estado de user guardado en bdd.
  const [user, setUser] = useState<User | null>(null);

  const nickMapRef = useRef<Record<number, string>>({});

  //ESTADO PARA EL APPSTORE
  const [appStore, setAppStore] = useState<AppStore>(INITIAL_STATE);

  //toda esta funcion es para lo privado al seleccionar un usuario del directorio
const handleSelectClient = async (userId: number, nick: string) => {
  setActiveFeed(true);
  setPrivateIdMsg(userId);
  setClientSelected(nick);

  // Reset unread
  setAppStore((prev) => ({
    ...prev,
    inboxMeta: {
      ...prev.inboxMeta,
      [userId]: {
        ...prev.inboxMeta[userId],
        unreadCount: 0,
        hasNewMessages: false,
      },
    },
  }));

  //Cargar histórico solo si no hay mensajes cargados
  const existing = appStore.store.feed.private[userId];
  if (!existing || existing.order.length === 0) {
    const id = userId.toString();
    const offset = 0;
    const limit = appStore.store.remote.limit;

    const messages = await resolve_private_messages(userId, offset, limit);
    const normalized_msg = normalize_msg_private(messages);

    setAppStore((prev) => handleUpdatePrivateData(normalized_msg, prev, id));
  }
};


  const handleSearchMsg = async (e: FormEvent<HTMLFormElement>) => {
    //busqueda de mensajes
    e.preventDefault();

    if (!inputMsgSearch) return;

    const query = inputMsgSearch.trim().toLowerCase();

    if (clientSelected && privateIdMsg) {
      //aca deberia poner el helper para la busqueda de mensajes privados
      const history_msg = await resolve_search_private_messages(
        query,
        privateIdMsg,
      );
      //cuando tenga los resultados deberia actualizar el estado que guarda los mensajes filtrados
      const normalized_msg = normalize_msg_private(history_msg);
      const id = privateIdMsg.toString();
      setAppStore((prev) =>
        handleUpdateSearchMsgPriv(query, prev, normalized_msg, id),
      );
    } else {
      //aca deberia poner el helper para la busqueda de mensajes publicos
      const history_msg = await resolve_search_public_messages(query);
      //cuando tenga los resultados deberia actualizar el estado que guarda los mensajes filtrados
      const normalized_msg = normalize_msg_public(history_msg);

      setAppStore((prev) =>
        handleUpdateSearchMsgPublic(query, prev, normalized_msg),
      );
    }
  };

  //esta la vamos a usar en el filtro tipo WS
  const onChangeSearchMsgFeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = e.currentTarget.value;
    setInputMsgSearch(data);

    if (data.trim() === "") {
      if (appStore.store.feed.active === "public")
        handleNewFeedPublic(appStore);
      if (appStore.store.feed.active === "private" && privateIdMsg) {
        const id = privateIdMsg.toString();
        handleNewFeedPrivate(appStore, id);
      }
    }
  };

  const handleActiveUser = () => {
    //esta funcion cambia tres estados que manejan la visibilidad del formulario de ingreso/registro del nick. Ademas limpia los inputs y el booleano que controla si el nick esta registrado, asi cuando aparezca el boton "X" y cerras el fomulario ademas de ir atras, limpias todo para que el boton diga nuevamente "registrar" y el input este el blanco.
    setActiveUser(true);
    //setInputRegister("");
    //setHasNickname(!hasNickname);
  };

  const sendMessagePrivate = (event: FormEvent) => {
    event.preventDefault();

    if (!socketRef.current?.nickname) return;
    const messageId = nanoid();
    if (privateIdMsg && inputMsg) {
      const message: SendMessage = {
        timestamp: new Date().toString(),
        type: "chat.send",
        messageId: messageId,
        payload: {
          scope: "chat.private",
          text: inputMsg,
          toId: privateIdMsg,
        },
      };
      console.log(message, "mensaje que enviaremos");

      socketRef.current?.send(JSON.stringify(message));
      //actualizacion de estados
      setInputMsg("");
    }
  };
  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!socketRef.current?.nickname) return;

    const messageId = nanoid();
    if (inputMsg) {
      const message: SendMessage = {
        timestamp: new Date().toString(), //buscar el cambio de comportamiento debimos cambiar tolocaletimestring por tostring para solucuonar un error de parseo de date en el la bdd
        type: "chat.send",
        messageId: messageId,
        payload: {
          scope: "chat.public",
          text: inputMsg,
        },
      };
      socketRef.current?.send(JSON.stringify(message));
      setInputMsg("");
      //actualizacion de estados
    }
  };

  const changeInputMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const data = event.currentTarget;
    setInputMsg(data.value);
  };

  //ahora esta funcion tambien va a lanzar la peticion de mensajes publicos, tiene que ser async y ademas recibir en orden los parametros para la query
  const returnToGroup = async () => {
    const offsetPublic = appStore.store.feed.public.remote.offset;
    const limitPublic = appStore.store.remote.limit;
    const public_msg = await resolve_public_messages(offsetPublic, limitPublic);
    console.log(public_msg);

    setPrivateIdMsg(undefined);
    setClientSelected("");
    setActiveFeed(true);
    setInputSearch("");
    //reset de metadata en inbox privados, update de offset, order, byId y hasmore

    //setMessageFeed((prev) => [...prev, ...public_msg]); esto ahora vive en el appstore
    //setResSearch([]);

    //con este setter deberia comprender las mismas funciones que los dos que tengo comentado una linea arriba. Si estoy en chat privado o en una busqueda privada y presiono ir al chat publico, seteo el cambio de modo a remoto por las dudas, cambio el active a public y con un efecto deberia escuchar esa dependencia y cambiar el feed que leo viendo public y pasando ahora la informacion del estado que designe al feed.
    setAppStore((prev) => ({
      ...prev,
      store: {
        ...prev.store,
        local: {
          ...prev.store.local,
          matches: [],
          activeIndex: 0,
          hasMore: false,
        },
        feed: {
          ...prev.store.feed,
          active: "public",
          mode: "remote",
        },
      },
    }));
  };

  //CONTROLLER DE SETTERS
  const controller = useMemo<DispatchContext>(
    () => ({
      addMessage: (parse) => {
        if (parse.scope === "public") {
          uptadeInboxPublic(setAppStore, parse);
        }
        if (parse.scope === "private") {
          const myId = socketRef.current?.userId;
          if(myId === undefined) return

          const conversationId = 
          parse.fromId === myId
           ? parse.toId?.toString() 
           : parse.fromId?.toString();
          if (conversationId) {
            uptadeInboxPrivate(setAppStore, parse, conversationId);
          }
        }
      },
      addMessageSystem: (parse) => {
        if (parse.text.includes("ingresaste")) {
          setHasNickname(true);
        }
        uptadeInboxSystem(parse, setAppStore);
      },
      handleAck: (parse, socket) => {
        socket.isAlive = true;
        socket.nickname = parse.payload.nickname;
        socket.userId = parse.payload.id;
        updateDataUser(parse, setAppStore);
      },
      setClients: (parse) => {
        for (const c of parse) {
          nickMapRef.current[c.userId] = c.nick;
        }
        updateDataSnapshot(parse, setAppStore);
      },
    }),
    [],
  );
  //useeffect para el inicio del socket y estructura de la informacion

  useEffect(() => {
    if (user === null) {
      console.log("intento para ver por que no sale", user);
      return;
    }

    try {
      const socket = new WebSocket(`${port}`);
      socketRef.current = socket;
      socketRef.current.addEventListener("open", (event) => {
        startHeartbeat(socketRef.current!);
        console.log("cliente conectado al servidor");
      });
      socketRef.current.addEventListener("message", async (event) => {
        const parse: ServerToClientMessage = JSON.parse(event.data);

        if (socketRef.current !== null) {
          dispatcher_ws_event(parse, controller, socketRef.current);
        }
      });
      socketRef.current.addEventListener("close", (event) => {
        cleanIntervals();
        console.log(`${socketRef.current?.nickname} sale del chat`);
      });
      socketRef.current.addEventListener("error", (event) => {
        console.log("Error connecting to server");
      });
    } catch (error) {
      console.log(`error al iniciar el socket: ${error}`);
    }

    return () => {
      socketRef.current?.close();
    };
  }, [user, controller]);

  useEffect(() => {
    if (!privateIdMsg) {
      setAppStore((prev) => ({
        ...prev,
        store: {
          ...prev.store,
          feed: {
            ...prev.store.feed,
            mode: "remote",
            active: "public",
            private: {},
          },
        },
      }));
      return;
    }
  }, [appStore.clients, privateIdMsg]);

  const value = {
    socketRef,
    hasNickname,
    setHasNickname,
    privateIdMsg,
    setPrivateIdMsg,
    clientSelected,
    setClientSelected,
    handleSelectClient,
    handleActiveUser,
    activeUser,
    setActiveUser,
    inputMsg,
    setInputMsg,
    sendMessagePrivate,
    sendMessage,
    changeInputMessage,
    returnToGroup,
    activeFeed,
    setActiveFeed,
    inputMsgSearch,
    setInputMsgSearch,
    handleSearchMsg,
    onChangeSearchMsgFeed,

    messageRefs,
    inputSearch,
    setInputSearch,

    //nueos estados
    user,
    setUser,
    appStore,
    setAppStore,
  };
  //value son los valores que vamos a pasar desde aca a la app, todas las props

  return <ContextApp.Provider value={value}>{children}</ContextApp.Provider>;
};
