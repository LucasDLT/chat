import { FormEvent } from "react";
import Image from "next/image";

interface InputMsgChatProps {
  privateIdMsg: string | undefined;
  sendMessagePrivate: (e: React.FormEvent<HTMLFormElement>) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  changeInputMessage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMsg: string | undefined;
  activeFeed: boolean;
}
export const InputMsgChat: React.FC<InputMsgChatProps> = ({
  privateIdMsg,
  sendMessagePrivate,
  sendMessage,
  changeInputMessage,
  inputMsg,
  activeFeed,
}) => {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //funcion para elegir que funcion se activa, si msg privado o publico, la tuve que hacer de esta forma por los tipados diferentes del event de la funcion de cada una, antes tenia el ternario en el mismo onsubmit, pero al tipar todo ya no me dejo hacer eso typescript
    if (privateIdMsg && inputMsg) {
      sendMessagePrivate (e);
    } else {
      sendMessage(e);
    }
  }
  return (
    activeFeed && (
      <form
        
        onSubmit={handleSubmit}
        className="flex items-center justify-center bg-black px-3 absolute bottom-2 right-1 h-[7vh]  rounded-none w-[98vw] xl:bottom-1 xl:right-35 xl:w-[70vw] xl:h-[8vh] xl:rounded"
      >
        <input
          onChange={changeInputMessage}
          value={inputMsg ? inputMsg : ""}
          type="text"
          className=" m-1 rounded xl:w-full xl:h-10 bg-neutral-800 text-white p-1"
        />
        <button type="submit" className=" m-1 rounded bg-neutral-800 text-white text-sm p-1.5 hover:cursor-pointer">
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
