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
    (console.log(inputMsg), "en submit");

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
        className=" bg-white h-full flex justify-center items-center min-w-0"
      >
        <input
          onChange={changeInputMessage}
          value={inputMsg ? inputMsg : ""}
          type="text"
          className=" m-1 rounded xl:w-250 xl:h-10 bg-neutral-800 text-white p-1"
        />
        <button
          type="submit"
          className=" m-1 rounded bg-neutral-800 text-white text-sm p-1.5 hover:cursor-pointer"
        >
          <Image
            src={"/icons/enviar.png"}
            alt="enviar mensaje"
            width={20}
            height={30}
          />
        </button>
      </form>
    )
  );
};
