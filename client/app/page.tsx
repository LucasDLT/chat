"use client";
import { timeStamp } from "console";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function Home() {
  const port = process.env.NEXT_PUBLIC_WS_PORT;
  const socketRef = useRef<WebSocket | null>(null);
  const [inputRegister, setInputRegister] = useState<string | undefined>("");

  useEffect(() => {
    const socket = new WebSocket(`${port}`);
    socketRef.current = socket;
    socketRef.current.addEventListener("open", (event) => {
      console.log("Connected to server");
    });
    socketRef.current.addEventListener("message", (event) => {
      console.log(event.data);
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
    const messageId=crypto.randomUUID()
    const registerNick={
      type:"registerNickname",
      timestamp:Date.now(),
      payload:{
        messageId:messageId,
        nickname:inputRegister
      }

    }
    console.log({registerNick});
    socketRef.current?.send(JSON.stringify(registerNick))
    setInputRegister("");

  };
  const changeRegisterNick = (event: FormEvent) => {
    event.preventDefault();
    const data = event.currentTarget as HTMLInputElement;
    setInputRegister(data.value);
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
        <button  className="border rounded p-1 m-1">
          registrar
        </button>
      </form>
    </div>
  );
}
