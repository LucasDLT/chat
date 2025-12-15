import Image from "next/image";
import { InputMsgSearch } from "../InputMsgSearch";
import { ChangeEvent } from "react";
import { MsgInFeed } from "@/types/types";
import { useAppContextWs } from "@/context/context";
import {MessageItem} from "@/components/msgItem"

interface FeedProps {
  activeFeed: boolean;
  privateIdMsg: string | undefined;
  messageFeed: MsgInFeed[];
  messageFeedPriv: MsgInFeed[];
  clientSelected: string | undefined;
  resMsgSearch:MsgInFeed[] | undefined;

  //props para el inputsearchmsg
  inputMsgSearch: string | undefined;
  onChange: (e:ChangeEvent<HTMLInputElement>) => void;
  handleSearchMsg: (e: React.FormEvent<HTMLFormElement>) => void;

  matches: string[];
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  activeIndex: number;
}

export const FeedSection: React.FC<FeedProps> = ({
  activeFeed,
  privateIdMsg,
  messageFeed,
  messageFeedPriv,
  clientSelected,
  inputMsgSearch,
  onChange,
  handleSearchMsg, 
  matches,
  setActiveIndex,
  activeIndex
}) => {
    const {searchMatches, activeMatchIndex}=useAppContextWs()
    const activeMessageId = searchMatches[activeMatchIndex]; // aca al array searchmatches le pasamos una ubicacion de index 0 por que array[0] es estar parados en la posicion 0 de l alista

  return (
    <section
      className={`${
        activeFeed
          ? "flex yellowBg justify-center items-center h-100vh "
          : "hidden"
      }`}
    >
      <InputMsgSearch inputMsgSearch={inputMsgSearch} onChange={onChange} handleSearchMsg={handleSearchMsg} activeIndex={activeIndex} matches={matches} setActiveIndex={setActiveIndex} />

      {privateIdMsg ? (
        <section
          className={`h-[65vh] w-95 top-46 xl:h-[90vh] xl:w-[80vw]  absolute xl:top-1 xl:right-16.5 rounded-bl-xs rounded-br-xs 
          `}
        >
          <Image
            src={"/background-directorio.jpg"}
            width={3000}
            height={1000}
            alt="background feed chat"
            className={`w-full h-full object-cover z-0 rounded-xs`}
          ></Image>
          <h3 className="absolute top-5 left-25 xl:top-0 rounded-b-sm bg-yellow-50/25 tracking-wider  xl:left-56 flex justify-center items-center w-60 xl:w-[50vw] h-10 text-2xl mesoninaRegular backdrop-blur-xl z-10">
            {clientSelected}
          </h3>
          <div
            className={` flex flex-col items-center overflow-y-auto h-[40vh] xl:h-[84vh] absolute g-2 top-14 xl:top-11  w-94 xl:w-[79vw]`}
          >
            {messageFeedPriv.map((msg) => {
              const isMatch = searchMatches.includes(msg.messageId)
              const isActive= msg.messageId === activeMessageId
              return (
                <MessageItem
                key={msg.messageId}
                isActive={isActive}
                isMatch={isMatch}
                message={msg}
                 />
              );
            })}
          </div>
        </section>
      ) : (
        //section para el feed de mensajes publicos
        <section className=" h-[65vh] w-95 top-46 xl:h-[90vh] xl:w-[80vw]  absolute xl:top-1 xl:right-16.5 rounded-sm">
          <Image
            src={"/background-directorio.jpg"}
            width={3000}
            height={1000}
            alt="background feed chat"
            className={`w-full h-full object-cover z-0 rounded-xs`}
          ></Image>
          <h3 className="absolute top-5 left-25 xl:top-0 rounded-b-sm bg-yellow-50/25 tracking-wider xl:left-56 flex justify-center items-center w-60 xl:w-[50vw] h-10 text-2xl mesoninaRegular backdrop-blur-xl z-10">
            mensaje publico
          </h3>
          <div
            className={` flex flex-col items-center overflow-y-auto h-[40vh] xl:h-[84vh] absolute g-2 top-14 xl:top-11  w-94 xl:w-[79vw]`}
          >
            {messageFeed.map((msg, index) => {
              return (
                <p key={index} className="text-center mt-2 xl:mt-2 ">
                  {msg.msg}
                </p>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
};
