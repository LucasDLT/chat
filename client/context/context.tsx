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
  SetStateAction,
} from "react";
import { cleanIntervals, startHeartbeat } from "@/helpers";
import {
  ChangeNickname,
  ClientsConected,
  MsgInFeed,
  ProcessMsg,
  RegisterNickname,
  SendMessage,
  ServerToClientMessage,
} from "@/types/types";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

interface IcontextProps {
  //interface para las variables, setters o handlers que pase por contexto a la app
  socketRef: React.RefObject<WebSocket | null>;
  setMessageFeed: React.Dispatch<React.SetStateAction<MsgInFeed[]>>;
  messageFeed: MsgInFeed[];
  hasNickname: boolean;
  setHasNickname: React.Dispatch<React.SetStateAction<boolean>>;
  nickConected: ClientsConected[];
  setNickConected: React.Dispatch<React.SetStateAction<ClientsConected[]>>;
  messageFeedPriv: MsgInFeed[];
  setMessageFeedPriv: React.Dispatch<React.SetStateAction<MsgInFeed[]>>;
  conectedCount: number;
  setConectedCount: React.Dispatch<React.SetStateAction<number>>;
  privateIdMsg: string | undefined;
  setPrivateIdMsg: React.Dispatch<React.SetStateAction<string | undefined>>;
  clientSelected: string | undefined;
  setClientSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSelectClient: (userId: string, nick: string) => void;
  handleActiveRegister: () => void;
  activeRegister: boolean;
  setActiveRegister: React.Dispatch<React.SetStateAction<boolean>>;
  changeRegisterNick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRegister: string | undefined;
  setInputRegister: React.Dispatch<React.SetStateAction<string | undefined>>;
  inputMsg: string | undefined;
  setInputMsg: React.Dispatch<React.SetStateAction<string | undefined>>;
  registerNick: (e: React.FormEvent<HTMLFormElement>) => void;
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
  resMsgSearch: MsgInFeed[];
  setResMsgSearch: React.Dispatch<React.SetStateAction<MsgInFeed[]>>;
  searchMatches:string[]
  setSearchMatches:React.Dispatch<React.SetStateAction<string[]>>
  activeMatchIndex:number;
  setActiveMatchIndex:React.Dispatch<React.SetStateAction<number>>
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
      "Error al intentar ingresar al contexto, en este momento en null o estas intentando accerder fuera del dominio de su provider"
    );
  }
  return contextWs;
}

//HACER EL CONTEXTO CON EL CUSTOM HOOK QUE VIMOS, PARA ELIMINAR ERRORES
export const ContextWebSocket = ({ children }: ContextProviderProps) => {
  const port = process.env.NEXT_PUBLIC_WS_PORT;
  const socketRef = useRef<WebSocket | null>(null);
  const [messageFeed, setMessageFeed] = useState<MsgInFeed[]>([]);
  const [messageFeedPriv, setMessageFeedPriv] = useState<MsgInFeed[]>([]);
  const [hasNickname, setHasNickname] = useState<boolean>(false);
  const [nickConected, setNickConected] = useState<ClientsConected[]>([]);
  const [conectedCount, setConectedCount] = useState<number>(0);
  const [privateIdMsg, setPrivateIdMsg] = useState<string | undefined>(
    undefined
  );
  const [clientSelected, setClientSelected] = useState<string | undefined>(
    undefined
  );
  const [inputRegister, setInputRegister] = useState<string | undefined>(
    undefined
  );
  const [inputMsg, setInputMsg] = useState<string | undefined>(undefined);
  const [activeRegister, setActiveRegister] = useState<boolean>(false);
  const [activeFeed, setActiveFeed] = useState<boolean>(false);
  const [inputMsgSearch, setInputMsgSearch] = useState<string | undefined>(
    undefined
  );
  const [resMsgSearch, setResMsgSearch] = useState<MsgInFeed[] | []>([]);

  //estado para el filtrado tipo wp
  const[searchMatches, setSearchMatches]=useState<string[]>([])
  //este es para los saltos entre indices del array de coincidencias del filtrado de arriba
  const[activeMatchIndex, setActiveMatchIndex]=useState<number>(0)

  const pendingNickRef = useRef<Record<string, string>>({});
  const router = useRouter();

  const registerNick = (event: FormEvent) => {
    event.preventDefault();
    const messageId = nanoid();

    if (inputRegister && !hasNickname) {
      const registerNick: RegisterNickname = {
        type: "registerNickname",
        timestamp: Date.now(),
        payload: {
          messageId: messageId,
          nickname: inputRegister,
        },
      };
      socketRef.current?.send(JSON.stringify(registerNick));
      //navegacion a /chat
      router.push("/chat");

      //limpieza del estado
      setInputRegister("");
    }
    if (inputRegister && hasNickname && socketRef.current?.userId) {
      const changeNickname: ChangeNickname = {
        type: "changeNickname",
        timestamp: Date.now(),
        payload: {
          messageId: messageId,
          nickname: inputRegister,
          userId: socketRef.current?.userId,
        },
      };
      socketRef.current?.send(JSON.stringify(changeNickname));
      pendingNickRef.current[messageId] = inputRegister; //con corchetes asigno la key para que el value sea inputRegister. Dejo esto para el yo de mañana por que ahora tengo sueño

      //navegacion a /chat
      if (socketRef.current?.nickname === inputRegister) {
        router.push("/chat");
      }
      //limpieza del estado
      setInputRegister("");
    }
  };
  const changeRegisterNick = (event: FormEvent) => {
    const data = event.currentTarget as HTMLInputElement;
    setInputRegister(data.value);
  };
  const handleSelectClient = (userId: string, nick: string) => {
    setActiveFeed(true);
    setPrivateIdMsg(userId);
    setClientSelected(nick);
    const client = nickConected.find((id) => id.userId === userId);
    if (Array.isArray(client?.msgPriv) && client.msgPriv !== undefined) {
      setMessageFeedPriv([...client.msgPriv]);
    } else {
      setMessageFeedPriv([]);
    }
    //replique la funcion para pushear con el setter el objeto dentro del estado con sus propiedades resteadas
    //aca en realidad lo que hacemos es: dentro del setter, mapear el estado solo para volver a 0 todas sus propiedades, por que estas sirven para que la lista de usuarios muestre si tiene mensajes sin leer, tras ingresar una vez estas se resetean y no vuelven a mostrar nada, hasta recibir mensajes nuevamente
    setNickConected((prev) =>
      prev.map((c) =>
        c.userId === userId
          ? { ...c, messageIn: false, totalMessageIn: 0, msgPriv: [] }
          : c
      )
    );
  };
 const handleSearchMsg = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!inputMsgSearch) return;

  const query = inputMsgSearch.trim().toLowerCase();

  if (clientSelected && privateIdMsg) {
    const res = messageFeedPriv
      .filter(m => m.msg.toLowerCase().includes(query))
      .map(m => m.messageId);

    setSearchMatches(res);
    setActiveMatchIndex(0)
    console.log(res);
    
  } else if (messageFeed) {
    const res = messageFeed
      .filter(m => m.msg.toLowerCase().includes(query))
      .map(m => m.messageId);

    setSearchMatches(res);
    setActiveMatchIndex(0)
    console.log(res);
    
  }
};


  //esta la vamos a usar en el filtro tipo WS
  const onChangeSearchMsgFeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = e.currentTarget.value;
    setInputMsgSearch(data);
  };

  const handleActiveRegister = () => {
    //esta funcion cambia tres estados que manejan la visibilidad del formulario de ingreso/registro del nick. Ademas limpia los inputs y el booleano que controla si el nick esta registrado, asi cuando aparezca el boton "X" y cerras el fomulario ademas de ir atras, limpias todo para que el boton diga nuevamente "registrar" y el input este el blanco.
    setActiveRegister(!activeRegister);
    setInputRegister("");
    setHasNickname(false);
  };

  const sendMessagePrivate = (event: FormEvent) => {
    event.preventDefault();
    const messageId = nanoid();
    if (privateIdMsg && inputMsg) {
      const message: SendMessage = {
        timestamp: Date.now(),
        type: "chat.send",
        messageId: messageId,
        payload: {
          scope: "chat.private",
          text: inputMsg,
          toId: privateIdMsg,
        },
      };
      socketRef.current?.send(JSON.stringify(message));
      setInputMsg("");
      setMessageFeedPriv((prev) => [
        ...prev,
        { msg: inputMsg, messageId: messageId, timestamp: message.timestamp },
      ]);
    }
  };
  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const messageId = nanoid();
    if (inputMsg) {
      const message: SendMessage = {
        timestamp: Date.now(),
        type: "chat.send",
        messageId: messageId,
        payload: {
          scope: "chat.public",
          text: inputMsg,
        },
      };
      socketRef.current?.send(JSON.stringify(message));
      setInputMsg("");
      setMessageFeed((prev) => [
        ...prev,
        { messageId: messageId, msg: inputMsg, timestamp: message.timestamp },
      ]);
    }
  };

  const changeInputMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const data = event.currentTarget;
    setInputMsg(data.value);
  };
  const returnToGroup = () => {
    setPrivateIdMsg("");
    setClientSelected("");
    setActiveFeed(true);
  };

  useEffect(() => {
    try {
      const socket = new WebSocket(`${port}`);
      socketRef.current = socket;
      socketRef.current.addEventListener("open", (event) => {
        startHeartbeat(socketRef.current!);
        console.log("cliente conectado al servidor");
      });
      socketRef.current.addEventListener("message", async (event) => {
        const parse: ServerToClientMessage = JSON.parse(event.data);
        // console.log("lo que llega del servidor antes de la funcion normalizadora", parse);
        const handleProcesMsgToFeed = (
          msg: ServerToClientMessage,
          client: WebSocket
        ): Promise<ProcessMsg> => {
          return new Promise((resolve, reject) => {
            //este if cubre el registro donde el servidor me devuelve el id del cliente creado una vez que verifica que el messageId no esta duplicado
            if (
              msg.type === "ack" &&
              msg.payload.status === "ok" &&
              msg.payload.fromId
            ) {
              client.userId = msg.payload.fromId;
              client.isAlive = true;

              client.nickname = msg.payload.nickname;
              console.log("nick del socket modificado", client.nickname);
            }
            //este en el caso del register que estoy probando captura el mensaje personalizado de que ingreso a la sala y si resuelve la promesa
            if (msg.type === "system" && msg.payload.message) {
              resolve({
                systemMessage: {
                  type: msg.type,
                  timestamp: msg.timestamp,
                  payload: { message: msg.payload.message },
                },
              });
            }
            //con este el mensaje publico
            if (msg.type === "chat.public" && msg.payload.text) {
              resolve({
                message: {
                  type: msg.type,
                  text: msg.payload.text,
                  messageId: msg.messageId,
                  timestamp: msg.timestamp,
                },
              });
            }
            if (
              msg.type === "chat.private" &&
              msg.payload.text &&
              msg.payload.toId
            ) {
              resolve({
                message: {
                  type: msg.type,
                  text: msg.payload.text,
                  toId: msg.payload.toId,
                  fromId: msg.payload.fromId,
                  messageId: msg.messageId,
                  timestamp: msg.timestamp,
                },
              });
            }
            if (msg.type === "snapshot:clients" && msg.payload) {
              const conectedNicks: ClientsConected[] = [];
              for (const c of msg.payload) {
                let newObj = {
                  userId: c.userId,
                  nick: c.nickname,
                };
                conectedNicks.push(newObj);
              }
              resolve({ clients: conectedNicks });
            }
          });
        };

        if (socketRef.current !== null) {
          let message = await handleProcesMsgToFeed(parse, socketRef.current);
          console.log("listado resuelto", message);
          //para el mensaje system hago el id y verifico que este el system

          if (
            message?.systemMessage !== undefined &&
            message?.systemMessage?.type === "system" &&
            message?.systemMessage?.payload !== undefined
          ) {
            const {timestamp, payload}=message.systemMessage
            const messageIdSystem = nanoid()
            setMessageFeed((prev) => [
              ...prev,
              {
                messageId: messageIdSystem,
                timestamp:timestamp ,
                msg: payload.message,
              },
            ]);
            if (message.systemMessage?.payload.message.includes("ingresaste")) {
              setHasNickname(true);
            }
          }

          //datos para el feed de mensajes
          if (
            message.message?.type === "chat.public" &&
            typeof message.message.text === "string"
          ) {
            const { text, messageId, timestamp } = message.message;
            //aca deberia tipar el mensaje publico agregando messageId y timestamp: HACER
            setMessageFeed((prevMsg) => [...prevMsg, {msg:text, timestamp:timestamp, messageId:messageId}]);
          }

          //datos para los chats privados
          if (
            message.message?.type === "chat.private" &&
            message.message?.toId
          ) {
            const { text, messageId, timestamp, fromId } = message.message;

            setMessageFeedPriv((prev) => [...prev, {msg:text, messageId:messageId, timestamp:timestamp }]);
            //aca recorde que el estado solo podria modificarlo el setter y no una funcion externa, se puede hacer el set y dentro aplicar un map o lo que querramos, mientras devuelva la variable modificada, en este caso las propiedades del estado que era un objeto se cambiaron.
            //aca es a donde deberia tipar el mensaje, y agregar messageId y timestamp:HACER

            setNickConected((prev) =>
              prev.map((c) =>
                c.userId === fromId
                  ? {
                      ...c,
                      messageIn: true,
                      totalMessageIn: (c.totalMessageIn ?? 0) + 1,
                      msgPriv: [...(c.msgPriv ?? []), {msg:text, messageId:messageId, timestamp:timestamp }],
                    } 
                  : c
              )
            );
          }

          //datos para el feed de clientes conectados
          if (Array.isArray(message.clients)) {
            const nicks = message.clients;
            setNickConected(nicks);
            //datos para el contador y nicks conectados
            setConectedCount(nicks.length);
          }
        }
      });
      socketRef.current.addEventListener("close", (event) => {
        cleanIntervals();
        console.log("Disconnected from server");
      });
      socketRef.current.addEventListener("error", (event) => {
        console.log("Error connecting to server");
      });
    } catch (error) {
      console.log(`error capturado en catch del useeffect inicial: ${error}`);
    }

    return () => {
      socketRef.current?.close();
    };
  }, []);
  const value = {
    socketRef,
    messageFeed,
    setMessageFeed,
    hasNickname,
    setHasNickname,
    nickConected,
    setNickConected,
    messageFeedPriv,
    setMessageFeedPriv,
    conectedCount,
    setConectedCount,
    privateIdMsg,
    setPrivateIdMsg,
    clientSelected,
    setClientSelected,
    handleSelectClient,
    handleActiveRegister,
    activeRegister,
    setActiveRegister,
    changeRegisterNick,
    inputRegister,
    setInputRegister,
    inputMsg,
    setInputMsg,
    registerNick,
    sendMessagePrivate,
    sendMessage,
    changeInputMessage,
    returnToGroup,
    activeFeed,
    setActiveFeed,
    inputMsgSearch,
    setInputMsgSearch,
    handleSearchMsg,
    setResMsgSearch,
    resMsgSearch,
    onChangeSearchMsgFeed,
    setSearchMatches,
    searchMatches,
    setActiveMatchIndex,
    activeMatchIndex
  };
  //value son los valores que vamos a pasar desde aca a la app, todas las props

  return <ContextApp.Provider value={value}>{children}</ContextApp.Provider>;
};
