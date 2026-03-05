"use client";
import { FormEvent } from "react";
import Image from "next/image";
import { useAppContextWs } from "@/context/context";

export const InputMsgChat = () => {
  const {
    changeInputMessage,
    inputMsg,
    privateIdMsg,
    sendMessage,
    sendMessagePrivate,
    activeFeed,
  } = useAppContextWs();
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //funcion para elegir que funcion se activa, si msg privado o publico, la tuve que hacer de esta forma por los tipados diferentes del event de la funcion de cada una, antes tenia el ternario en el mismo onsubmit, pero al tipar todo ya no me dejo hacer eso typescript
    if (privateIdMsg && inputMsg) {
      sendMessagePrivate(e);
    } else {
      sendMessage(e);
    }
  }
  return (
    activeFeed && (
      <form
        onSubmit={handleSubmit}
        className="h-full flex justify-center items-center min-w-0 gap-1"
      >
        <input
          onChange={changeInputMessage}
          value={inputMsg ? inputMsg : ""}
          type="text"
          className="rounded-bl-xl w-full xl:w-250 xl:h-10 bg-[#d4ab4a78] text-white"
        />
        <button
          type="submit"
          className="text-white text-sm hover:cursor-pointer rounded-br-xl px-2"
        >
          <Image
            src={"/icons/enviar.png"}
            alt="enviar mensaje"
            width={26}
            height={20}
          />
        </button>
      </form>
    )
  );
};
