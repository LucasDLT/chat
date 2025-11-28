"use client";
import { cleanIntervals, startHeartbeat } from "@/helpers";
import {
  ClientsConected,
  ProcessMsg,
  RegisterNickname,
  SendMessage,
  ServerToClientMessage,
  userData,
} from "@/types/types";
import { nanoid } from "nanoid";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function Home() {
  const port = process.env.NEXT_PUBLIC_WS_PORT;
  const socketRef = useRef<WebSocket | null>(null);
  const [inputRegister, setInputRegister] = useState<string | undefined>("");
  const [messageFeed, setMessageFeed] = useState<string[]>([]);
  const [inputMsg, setInputMsg] = useState<string | undefined>("");
  const [conectedCount, setConectedCount] = useState<number>();
  const [nickConected, setNickConected] = useState<ClientsConected[]>([]);
  const [privateIdMsg, setPrivateIdMsg] = useState<string | undefined>("");
  const [clientSelected, setClientSelected] = useState<string | undefined>("");
  const [messageFeedPriv, setMessageFeedPriv] = useState<string[]>([]);

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
            setMessageFeedPriv((prev: string[]) => [...prev, msg]);
          }

          //datos para el feed de clientes conectados
          if (Array.isArray(message.clients)) {
            const nicks = message.clients;
            setNickConected(nicks);
            //datos para el contador y nicks conectados
            setConectedCount(nicks.length);
            if (nickConected) {
              nickConected.forEach((c)=>{
                console.log("lista de conectados",c.nick);

              })
              
            }
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

  const handleSelectClient = (userId: string, nick: string) => {
    setPrivateIdMsg(userId);
    setClientSelected(nick);
  };
  const registerNick = (event: FormEvent) => {
    event.preventDefault();
    const messageId = nanoid();

    if (inputRegister) {
      const registerNick: RegisterNickname = {
        type: "registerNickname",
        timestamp: Date.now(),
        payload: {
          messageId: messageId,
          nickname: inputRegister,
        },
      };
      socketRef.current?.send(JSON.stringify(registerNick));
      setInputRegister("");
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
    <div className="flex flex-col justify-center items-center">
      <h1>chat</h1>
      {/*formulario para registrar nickname*/}
      <form
        onSubmit={registerNick}
        className="flex flex-col g-1 justify-center items-center"
      >
        <label>registrar nick</label>
        <input
          type="text"
          className="border border-amber-100"
          onChange={changeRegisterNick}
          value={inputRegister}
        />
        <button className="border rounded p-1 m-1">registrar</button>

        {/*contador de usuarios conectados*/}
        <div className="flex gap-2 p-4 m-1 rounded bg-gray-700">
          <button className="hover:cursor-pointer" onClick={returnToGroup}>
            grupo:{" "}
          </button>
          <p>{conectedCount ? conectedCount : "usuarios conectados"}</p>
        </div>

        {/*lista de usuarios conectados*/}

        <div className="flex gap-2 m-1 p-3 rounded bg-gray-700">
          <h3>usuarios</h3>
          <div>
            {nickConected.map((nick, index) => {
              return (
                <p
                  onClick={() => handleSelectClient(nick.userId, nick.nick)}
                  className="border p-1 bg-cyan-950 rounded hover:cursor-pointer"
                  key={index}
                >
                  {nick.nick}
                  {nick.messageIn}
                </p>
              );
            })}
            <p></p>
          </div>
        </div>

        {/*section para el feed de mensajes privados*/}
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
          /*section para el feed de mensajes publicos*/
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
      </form>
      {/*formulario para envio de mensajes*/}
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
    </div>
  );
}
