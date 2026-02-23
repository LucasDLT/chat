"use client";
import Image from "next/image";
import { ButtonsSearch } from "@/app/components/ButttonsSearch";
import { useAppContextWs } from "@/context/context";

export const InputMsgSearch = () => {
  const {
    onChangeSearchMsgFeed,
    inputMsgSearch,
    handleSearchMsg,
    clientSelected,
  } = useAppContextWs();

  return (
    <form
      className={`z-8 bg-amber-500 h-full grid grid-cols-[100px_240px_20px] min-w-0 min-h-0 gap-4 items-center justify-center `}
      onSubmit={handleSearchMsg}
    >
      {clientSelected
      ?<h3 className="z-10 border  bg-lime-500 text-black">{clientSelected}</h3>
      : <h3 className="z-10 border  bg-lime-500 text-black">mensaje grupal</h3>}
      <input
        onChange={onChangeSearchMsgFeed}
        type="text"
        className="bg-amber-600 text-black"
        value={inputMsgSearch ? inputMsgSearch : ""}
      />

      {inputMsgSearch ? (
        <ButtonsSearch />
      ) : (
        <button type="submit" className=" bg-blue-500">
          <Image
            src={"/icons/enviar.png"} //CAMBIAR POR UNA LUPA
            alt="enviar mensaje"
            width={20}
            height={30}
          />
        </button>
      )}
    </form>
  );
};
