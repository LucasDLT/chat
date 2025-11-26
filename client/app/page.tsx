"use client";
import {
  RegisterNickname,
  SendMessage,
  ServerToClientMessage,
} from "@/types/types";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function Home() {
  const port = process.env.NEXT_PUBLIC_WS_PORT;
  const socketRef = useRef<WebSocket | null>(null);
  const [inputRegister, setInputRegister] = useState<string | undefined>("");
  const [messageFeed, setMessageFeed] = useState<string[]>([]);
  const [inputMsg, setInputMsg] = useState<string | undefined>("");
  const [msgFeedPersonal, setMesgFeedPersonal]=useState<string>("")

  useEffect(() => {
    try {
      const socket = new WebSocket(`${port}`);
      socketRef.current = socket;
      socketRef.current.addEventListener("open", (event) => {
        console.log("cliente conectado al servidor");
      });
      socketRef.current.addEventListener("message", async (event) => {
        const parse:ServerToClientMessage = JSON.parse(event.data);
        console.log(parse);
         const handleProcesMsgToFeed =(msg:ServerToClientMessage, client:WebSocket):Promise<string> =>{
          return new Promise((resolve, reject)=>{
            //este if cubre el registro donde el servidor me devuelve el id del cliente creado una vez que verifica que el messageId no esta duplicado 
            if(msg.type === "ack" && msg.payload.status === "ok" && msg.payload.fromId){
              client.userId=msg.payload.fromId
            }
            //este en el caso del register que estoy probando captura el mensaje personalizado de que ingreso a la sala y si resuelve la promesa
            if (msg.type==="system" && msg.payload.message) {
              resolve(msg.payload.message)
            }
            //con este el mensaje publico
            if (msg.type==="chat.public" && msg.payload.text) {
              resolve(msg.payload.text)
            }
          })
         }
         if (socketRef.current !==null) {
           let message= await handleProcesMsgToFeed(parse, socketRef.current)
           console.log(message);
           setMessageFeed(prevMsg=> [... prevMsg, message])
           
         }
      });
      socketRef.current.addEventListener("close", (event) => {
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

  const registerNick = (event: FormEvent) => {
    event.preventDefault();
    const messageId = crypto.randomUUID();
    if (inputRegister) {
      const registerNick: RegisterNickname = {
        type: "registerNickname",
        timestamp: Date.now(),
        payload: {
          messageId: messageId,
          nickname: inputRegister,
        },
      };
      console.log("envio de register", { registerNick });
      socketRef.current?.send(JSON.stringify(registerNick));
      setInputRegister("");
    }
  };
  const changeRegisterNick = (event: FormEvent) => {
    const data = event.currentTarget as HTMLInputElement;
    setInputRegister(data.value);
  };

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const messageId = crypto.randomUUID();
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
      setMessageFeed(prev=>[...prev, inputMsg])

    }
  };
  const changeInputMessage = (event: FormEvent) => {
    const data = event.currentTarget as HTMLInputElement;
    setInputMsg(data.value);
  }; 
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>chat</h1>
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
        <section className="border h-[70vh] w-[50vw]">
          <p className="grid grid-cols-1 gap-2 bg-blue-950">{
          messageFeed.map((msg, index)=>{
            return<p key={index} className="border bg-gray-800">{msg}</p>}
          )
          }</p>
        </section>
      </form>
      <form
        onSubmit={sendMessage}
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
