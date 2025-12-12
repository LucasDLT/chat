import { ChangeEvent, FormEvent } from "react";
import Image from "next/image";

interface InputMsgSearchProps {
onChange: (e:ChangeEvent<HTMLInputElement>) => void;
inputMsgSearch: string | undefined;
handleSearchMsg:(e: React.FormEvent<HTMLFormElement>) => void;
}

export const InputMsgSearch:React.FC<InputMsgSearchProps> = ({onChange, inputMsgSearch, handleSearchMsg}) => {
  return (
    <form
      className={`z-11 xl:w-56 xl:h-9 xl:flex xl:justify-center xl:items-center absolute xl:right-78 xl:top-[5.6px]`}
      onSubmit={handleSearchMsg}
    >
      {/*NOTA: todavia no, pero en un momento voy a agregar aca una condicion con un estado que detecte en que modo de pantalla estamos y en que modo de feed estamos, dependendiendo de eso, este form va a ser para filtrar entre contactos o entre los mensajes del contacto seleccionado o del chat publico*/}
      <input
        onChange={onChange}
        type="text"
        className=" yellowBg h-6 rounded-xs text-black px-px text-center w-full mx-1 xl:w-45 xl:h-7"
        value={inputMsgSearch? inputMsgSearch : ""}
      />
      <Image
        alt="icon user"
        src={"/icons/lupa.png"}
        width={30}
        height={30}
        className="p-1 rounded-xs object-cover h-6 w-6"
      />
    </form>
  );
};
