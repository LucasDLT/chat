"use client";
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
import { FormEvent, useEffect, useRef, useState } from "react";
import { RegisterSection } from "@/components/RegisterSection";

export default function Home() {
  const port = process.env.NEXT_PUBLIC_WS_PORT;
  const socketRef = useRef<WebSocket | null>(null);
  const pendingNickRef=useRef<Record<string, string>>({})
  const [inputRegister, setInputRegister] = useState<string | undefined>("");
  const [messageFeed, setMessageFeed] = useState<string[]>([]);
  const [inputMsg, setInputMsg] = useState<string | undefined>("");
  const [conectedCount, setConectedCount] = useState<number>();
  const [nickConected, setNickConected] = useState<ClientsConected[]>([]);
  const [privateIdMsg, setPrivateIdMsg] = useState<string | undefined>("");
  const [clientSelected, setClientSelected] = useState<string | undefined>("");
  const [messageFeedPriv, setMessageFeedPriv] = useState<string[]>([]);
  const [hasNickname, setHasNickname] = useState<boolean>(false);
  const [activeRegister, setActiveRegister] = useState<boolean>(false);


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
          client: WebSocket,
        ): Promise<ProcessMsg> => {
          return new Promise((resolve, reject) => {
            //este if cubre el registro donde el servidor me devuelve el id del cliente creado una vez que verifica que el messageId no esta duplicado
            if (
              msg.type === "ack" &&
              msg.payload.status === "ok" &&
              msg.payload.fromId
            ) {
              client.userId = msg.payload.fromId;
              client.isAlive= true

              client.nickname=msg.payload.nickname
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

  const handleActiveRegister=() => {
    //esta funcion cambia tres estados que manejan la visibilidad del formulario de ingreso/registro del nick. Ademas limpia los inputs y el booleano que controla si el nick esta registrado, asi cuando aparezca el boton "X" y cerras el fomulario ademas de ir atras, limpias todo para que el boton diga nuevamente "registrar" y el input este el blanco. 
    setActiveRegister(!activeRegister)
    setInputRegister('')
    setHasNickname(false)
  }
  const handleSelectClient = (userId: string, nick: string) => {
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
      pendingNickRef.current[messageId]=inputRegister //con corchetes asigno la key para que el value sea inputRegister. Dejo esto para el yo de mañana por que ahora tengo sueño
    }
  };
  const changeRegisterNick = (event: FormEvent) => {
    const data = event.currentTarget as HTMLInputElement;
    setInputRegister(data.value);
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
  return (
    <div className="flex flex-col justify-center items-center yellowBg" >
      <RegisterSection onClick={handleActiveRegister} activeRegister={activeRegister} onChange={changeRegisterNick} value={inputRegister?inputRegister:""} onSubmit={registerNick} hasNickname={hasNickname} />
      {/*formulario para registrar nickname
      <form
        onSubmit={registerNick}
        className="flex flex-col g-1 justify-center items-center"
      >
        <label className="mesoninaRegular">Nick</label>
        <input
          type="text"
          className="border border-amber-100"
          onChange={changeRegisterNick}
          value={inputRegister}
        />
        <button className="border rounded p-1 m-1 ">
          {hasNickname ? "cambiar nick" : "registrar nick"}
        </button>
      </form>*/}

      {/*
      
              //contador de usuarios conectados
        <div className="flex gap-2 p-4 m-1 rounded bg-gray-700">
          <button className="hover:cursor-pointer" onClick={returnToGroup}>
            grupo:
          </button>
          <p>{conectedCount ? conectedCount : "usuarios conectados"}</p>
        </div>

        //lista de usuarios conectados

        <div className="flex gap-2 m-1 p-3 rounded bg-gray-700">
          <h3 className="mesoninaRegular">usuarios</h3>
          <div>
            {nickConected.map((nick, index) => {
              return (
                <p
                  onClick={() => handleSelectClient(nick.userId, nick.nick)}
                  className="border p-1 bg-cyan-950 rounded hover:cursor-pointer"
                  key={index}
                >
                  {nick.nick}
                  {nick.totalMessageIn ? `(${nick.totalMessageIn})` : ""}
                </p>
              );
            })}
            <p></p>
          </div>
        </div>

        //section para el feed de mensajes privados
        {privateIdMsg ? (
          <section className="border h-[70vh] w-[50vw]">
            <h3>hablas con {clientSelected}</h3>
            <div className="grid grid-cols-1 gap-2 bg-blue-950">
              {messageFeedPriv.map((msg, index) => {
                return (
                  <p key={index} className="border bg-gray-800">
                    {msg}
                  </p>
                );
              })}
            </div>
          </section>
        ) : (
          //section para el feed de mensajes publicos
          <section className="border h-[70vh] w-[50vw]">
            <div className="grid grid-cols-1 gap-2 bg-blue-950">
              {messageFeed.map((msg, index) => {
                return (
                  <p key={index} className="border bg-gray-800">
                    {msg}
                  </p>
                );
              })}
            </div>
          </section>
        )}
      */}
     
     {/*formulario para envio de mensajes*/}
     {/* 
      <form
        onSubmit={privateIdMsg ? sendMessagePrivate : sendMessage}
        className="flex items-center bg-amber-50 rounded mt-1"
      >
        <input
          onChange={changeInputMessage}
          value={inputMsg}
          type="text"
          className="border m-1 rounded bg-neutral-800 text-white p-1"
        />
        <button className="border m-1 rounded bg-neutral-800 text-white text-sm p-1.5 hover:cursor-pointer">
          enviar
        </button>
      </form>
      */}
      <section className="bg-black flex justify-center items-center xl:h-[40vh] xl:w-full ">
            <h1 className='animalHunter titleColor font-bold tracking-wider xl:text-7xl'>LIVE CHAT</h1>
      </section>
    </div>
  );
}
