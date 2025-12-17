"use client";
import Image from "next/image";
import { InputMsgSearch } from "../InputMsgSearch";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { MsgInFeed } from "@/types/types";
import { useAppContextWs } from "@/context/context";
import { MessageItem } from "@/components/msgItem";

interface FeedProps {
  activeFeed: boolean;
  privateIdMsg: string | undefined;
  messageFeed: MsgInFeed[];
  messageFeedPriv: MsgInFeed[];
  clientSelected: string | undefined;
  resMsgSearch: MsgInFeed[] | undefined;
  socketRef: React.RefObject<WebSocket | null>;

  //props para el inputsearchmsg
  inputMsgSearch: string | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearchMsg: (e: React.FormEvent<HTMLFormElement>) => void;

  //props para el filtrado WP
  matches: string[];
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  activeIndex: number;
  messageRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
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
  activeIndex,
  messageRefs,
  socketRef
}) => {
  const { searchMatches, activeMatchIndex } = useAppContextWs();
  const activeMessageId = searchMatches[activeMatchIndex]; // aca al array searchmatches le pasamos una ubicacion de index 0 por que array[0] es estar parados en la posicion 0 de l alista
  const refMessageInFeedPublic = useRef<HTMLDivElement | null>(null);
  const refMessageInFeedPrivate = useRef<HTMLDivElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const prevLengthRef = useRef(0);


  useEffect(() => {
  const currentFeed = privateIdMsg ? messageFeedPriv : messageFeed;
  const prevLength = prevLengthRef.current;

  if (currentFeed.length > prevLength) {
    if (!isNearBottom) {
      setUnreadCount((prev) => prev + (currentFeed.length - prevLength));
    }
  }

  prevLengthRef.current = currentFeed.length;
}, [messageFeed, messageFeedPriv, isNearBottom, privateIdMsg]);


  useEffect(() => {
    const container = privateIdMsg
      ? refMessageInFeedPrivate.current
      : refMessageInFeedPublic.current;

    if (!container) return;

    handleToBottom();

    container.addEventListener("scroll", handleToBottom);

    return () => {
      container.removeEventListener("scroll", handleToBottom);
    };
  }, [privateIdMsg]);

  useEffect(() => {
    if (!activeMessageId) return;

    const el = messageRefs.current[activeMessageId];

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeMessageId]);

  useEffect(() => {
    if (searchMatches.length > 0) return;

    const container = privateIdMsg
      ? refMessageInFeedPrivate.current
      : refMessageInFeedPublic.current;

    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      80;

    if (!isNearBottom) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messageFeed, messageFeedPriv, privateIdMsg, searchMatches.length]);

  //funcion de calculo solamente
  const handleToBottom = () => {
    const container = privateIdMsg
      ? refMessageInFeedPrivate.current
      : refMessageInFeedPublic.current;

    if (!container) return;

    //calculo para saber si estas abajo o arriba en el feed
    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;
    setIsNearBottom(nearBottom); //paso el valor contrario por que si el valor es true, si esta abajo el boton no tiene que mostrarse, y si el valor es false, no esta abajo, se tiene que mostrar, y como el estado inicia el false para no ser visible, la logica debe ser al reves. Dejo esta nota por que me consto entener la vuelta
  };

  //funcion para scrollear al final
  const handleGoToBottom = () => {
    const container = privateIdMsg
      ? refMessageInFeedPrivate.current
      : refMessageInFeedPublic.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
    setUnreadCount(0);
  };

  return (
    <section
      className={`${
        activeFeed
          ? "flex yellowBg justify-center items-center h-100vh "
          : "hidden"
      }`}
    >
      <InputMsgSearch
        inputMsgSearch={inputMsgSearch}
        onChange={onChange}
        handleSearchMsg={handleSearchMsg}
        activeIndex={activeIndex}
        matches={matches}
        setActiveIndex={setActiveIndex}
      />

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
            className={` flex flex-col overflow-y-auto h-[40vh] xl:h-[84vh] absolute g-2 top-14 xl:top-11  w-94 xl:w-[79vw]`}
            ref={refMessageInFeedPrivate}
          >
            {messageFeedPriv.map((msg) => {
              const isMatch = searchMatches.includes(msg.messageId);
              const isActive = msg.messageId === activeMessageId;
              return (
                <MessageItem
                  key={msg.messageId}
                  isActive={isActive}
                  isMatch={isMatch}
                  message={msg}
                  messageRefs={messageRefs}
                  myUserId={socketRef.current?.userId ?? ""}
                />
              );
            })}
          </div>
          {unreadCount > 0 && !isNearBottom && (
            <button
              onClick={handleGoToBottom}
              className="absolute right-5 bottom-0 m-4 rounded-full p-2 hover:cursor-pointer bg-amber-400/80 active:bgYellowActive z-30"
            >
              ↓ {unreadCount}
            </button>
          )}
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
            className={` flex flex-col justify-center overflow-y-auto h-[40vh] xl:h-[84vh] absolute g-2 top-14 xl:top-11  w-94 xl:w-[79vw]`}
            ref={refMessageInFeedPublic}
          >
            {messageFeed.map((msg) => {
              const isMatch = searchMatches.includes(msg.messageId);
              const isActive = msg.messageId === activeMessageId;
              
              return (
                <MessageItem
                  key={msg.messageId}
                  isActive={isActive}
                  isMatch={isMatch}
                  message={msg}
                  messageRefs={messageRefs}
                  myUserId={socketRef.current?.userId ?? ""}
                />
              );
            })}
          </div>
          {unreadCount > 0 && !isNearBottom && (
            <button
              onClick={handleGoToBottom}
              className="absolute right-5 bottom-0 m-4 rounded-full p-2 hover:cursor-pointer bg-amber-400/80 active:bgYellowActive z-30"
            >
              ↓ {unreadCount}
            </button>
          )}
        </section>
      )}
    </section>
  );
};
