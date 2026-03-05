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
      className={`z-8 grid grid-cols-[1fr_1fr_1fr] min-w-0 min-h-0 gap-1 items-center mb-0.5`}
      onSubmit={handleSearchMsg}
    >
      {clientSelected
      ?<h3 className="z-10 text-white  uppercase text-[13px] ">{clientSelected}</h3>
      : <h3 className="z-10 text-white text-[13px]  ">SALA PUBLICA</h3>}
      <input
        onChange={onChangeSearchMsgFeed}
        type="text"
        className="rounded-t-sm bg-[#d4ab4a78] text-white mr-1"
        value={inputMsgSearch ? inputMsgSearch : ""}
      />

      {inputMsgSearch ? (
        <ButtonsSearch />
      ) : (
        <button type="submit" className="">
          <Image
            src={"/icons/lupa.png"} //CAMBIAR POR UNA LUPA
            alt="enviar mensaje"
            width={16}
            height={30}
          />
        </button>
      )}
    </form>
  );
};
