"use client";
import Image from "next/image";
import { ButtonsSearch } from "@/app/components/ButttonsSearch";
import { useAppContextWs } from "@/context/context";

export const InputMsgSearch = () => {
  const {
    onChangeSearchMsgFeed,
    inputMsgSearch,
    handleSearchMsg,
  } = useAppContextWs();

  return (
    <form
      className={`z-11 top-36 justify-between right-6 w-40 items-center xl:w-56 xl:h-9 flex absolute xl:right-78 xl:top-[5.6px]`}
      onSubmit={handleSearchMsg}
    >
      <input
        onChange={onChangeSearchMsgFeed}
        type="text"
        className=" yellowBg h-6 rounded-xs text-black text-center w-34 xl:w-45 xl:h-7"
        value={inputMsgSearch ? inputMsgSearch : ""}
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
      {inputMsgSearch && (
        <ButtonsSearch/>
      )}
    </form>
  );
};
