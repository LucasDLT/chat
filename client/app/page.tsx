"use client";
import { RegisterNickname, SendMessage, ServerToClientMessage } from "@/types/types";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function Home() {
  const port = process.env.NEXT_PUBLIC_WS_PORT;
  const socketRef = useRef<WebSocket | null>(null);
  const [inputRegister, setInputRegister] = useState<string | undefined>("");
  const [messageFeed, setMessageFeed] = useState<string[] | undefined>([""]);
  const [inputMsg, setInputMsg] = useState<string | undefined>("");

  useEffect(() => {
    const socket = new WebSocket(`${port}`);
    socketRef.current = socket;
    socketRef.current.addEventListener("open", (event) => {
      setMessageFeed(["Conectado al servidor"]);
    });
    socketRef.current.addEventListener("message", (event) => {
      try {
        const raw = event instanceof Buffer ? event.toString() : String(event);
        const messageData:ServerToClientMessage = JSON.parse(raw);

        if (messageData.type !== "ack") {
          setMessageFeed((messageData) => [...(messageData ?? []), event.data]);
          console.log(event.data);
        }
      } catch (error) {
        console.log(error);
      }
    });
    socketRef.current.addEventListener("close", (event) => {
      console.log("Disconnected from server");
    });
    socketRef.current.addEventListener("error", (event) => {
      console.log("Error connecting to server");
    });
    return () => {
      socketRef.current?.close();
    };
  }, []);

  const registerNick = (event: FormEvent) => {
    event.preventDefault();
    const messageId = crypto.randomUUID();
if(inputRegister){    const registerNick:RegisterNickname = {
      type: "registerNickname",
      timestamp: Date.now(),
      payload: {
        messageId: messageId,
        nickname: inputRegister,
      },
    };
    console.log({ registerNick });
    socketRef.current?.send(JSON.stringify(registerNick));
    setInputRegister("");}
  };
  const changeRegisterNick = (event: FormEvent) => {
    const data = event.currentTarget as HTMLInputElement;
    setInputRegister(data.value);
  };

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const messageId = crypto.randomUUID();
    if(inputMsg){
    const message:SendMessage = {
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
    setMessageFeed((messageFeed) => [
      ...(messageFeed ?? []),
      JSON.stringify(message),
    ]);
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
          <p>{messageFeed}</p>
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
