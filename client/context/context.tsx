"use client";
import {
  useState,
  createContext,
  ReactNode,
  useEffect,
  useRef,
  useContext,
  FormEvent,
} from "react";
import { cleanIntervals, startHeartbeat } from "@/helpers";
import {
  ChangeNickname,
  ClientsConected,
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
  setMessageFeed: React.Dispatch<React.SetStateAction<string[]>>;
  messageFeed: string[];
  hasNickname: boolean;
  setHasNickname: React.Dispatch<React.SetStateAction<boolean>>;
  nickConected: ClientsConected[];
  setNickConected: React.Dispatch<React.SetStateAction<ClientsConected[]>>;
  messageFeedPriv: string[];
  setMessageFeedPriv: React.Dispatch<React.SetStateAction<string[]>>;
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
  sendMessagePrivate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  changeInputMessage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  returnToGroup: () => void;
  activeFeed:boolean;
  setActiveFeed:React.Dispatch<React.SetStateAction<boolean>>
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
  const [messageFeed, setMessageFeed] = useState<string[]>([]);
  const [hasNickname, setHasNickname] = useState<boolean>(false);
  const [nickConected, setNickConected] = useState<ClientsConected[]>([]);
  const [messageFeedPriv, setMessageFeedPriv] = useState<string[]>([]);
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
  const [activeFeed, setActiveFeed]=useState<boolean>(false)

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
    setActiveFeed(true)
    setPrivateIdMsg(userId);
    setClientSelected(nick);
    const client = nickConected.find((id) => id.userId === userId);
    if (Array.isArray(client?.msgPriv) && client.msgPriv !== undefined) {
      setMessageFeedPriv([...client.msgPriv]);
    } else {
      setMessageFeedPriv([]);
    }
    //replique la funcion para pushear con el setter el objeto dentro del estado con sus propiedades resteadas
    setNickConected((prev) =>
      prev.map((c) =>
          
        
        c.userId === userId
          ? { ...c, messageIn: false, totalMessageIn: 0, msgPriv: [] }
          : c
      )
    );
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
      setMessageFeedPriv((prev) => [...prev, inputMsg]);
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
      setMessageFeed((prev) => [...prev, inputMsg]);
    }
  };
  const changeInputMessage = (event: FormEvent) => {
    const data = event.currentTarget as HTMLInputElement;
    setInputMsg(data.value);
  };
  const returnToGroup = () => {
    setPrivateIdMsg("");
    setClientSelected("");
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
              resolve({ message: { type: msg.type, text: msg.payload.text } });
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
          //para el mensaje system
          if (
            message.systemMessage?.type &&
            message.systemMessage.type === "system"
          ) {
            let msg: string = message.systemMessage.payload.message;
            setMessageFeed((prev: string[]) => [...prev, msg]);
            if (message.systemMessage.payload.message.includes("ingresaste")) {
              setHasNickname(true);
            }

            console.log("nick del socket", socketRef.current.nickname);

            console.log("isalive del sokcket", socketRef.current.isAlive);
            console.log("id del sokcket", socketRef.current.userId);
          }

          //datos para el feed de mensajes
          if (
            message.message?.type === "chat.public" &&
            typeof message.message.text === "string"
          ) {
            let msg: string = message.message.text;
            setMessageFeed((prevMsg: string[]) => [...prevMsg, msg]);
          }

          //datos para los chats privados
          if (
            message.message?.type === "chat.private" &&
            message.message?.toId
          ) {
            let msg: string = message.message.text;
            let fromId: string = message.message.fromId!;
            setMessageFeedPriv((prev: string[]) => [...prev, msg]);
            //aca recorde que el estado solo podria modificarlo el setter y no una funcion externa, se puede hacer el set y dentro aplicar un map o lo que querramos, mientras devuelva la variable modificada, en este caso las propiedades del estado que era un objeto se cambiaron.
            setNickConected((prev) =>
              prev.map((c) =>
                c.userId === fromId
                  ? {
                      ...c,
                      messageIn: true,
                      totalMessageIn: (c.totalMessageIn ?? 0) + 1,
                      msgPriv: [...(c.msgPriv ?? []), msg],
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
    setActiveFeed
  };
  //value son los valores que vamos a pasar desde aca a la app, todas las props

  return <ContextApp.Provider value={value}>{children}</ContextApp.Provider>;
};
