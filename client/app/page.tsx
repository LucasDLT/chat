"use client";
import { useEffect, useRef } from "react";

export default function Home() {
  const port = process.env.NEXT_PUBLIC_WS_PORT;
  const socketRef = useRef<WebSocket | null>(null);

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
    })
    socketRef.current.addEventListener("error", (event) => {
      console.log("Error connecting to server");
    })
    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
