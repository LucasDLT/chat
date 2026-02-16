"use client";
import Image from "next/image";
import { InputMsgSearch } from "../InputMsgSearch";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { FeedMessage } from "@/types/types";
import { useAppContextWs } from "@/context/context";
import { MessageItem } from "@/app/components/msgItem";



export const FeedSection = () => {
  const { activeFeed,
privateIdMsg,
clientSelected,
appStore,
messageRefs,
socketRef } = useAppContextWs();
  const activeMessageId = appStore.store.local.matches[appStore.store.local.activeIndex]; // aca al array searchmatches le pasamos una ubicacion de index 0 por que array[0] es estar parados en la posicion 0 de l alista. Dice local por que es la buscada mediante buffer. No hay busqueda de este tipo en remote.
  const refMessageInFeedPublic = useRef<HTMLDivElement | null>(null);
  const refMessageInFeedPrivate = useRef<HTMLDivElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const prevLengthRef = useRef(0);
//NUEVOS MEMOS


const messageFeed = useMemo(() => {
  const publicFeed = appStore.store.feed.public;
  return publicFeed.order.map(id => publicFeed.byId[id]);
}, [appStore.store.feed.public]);

const messageFeedPriv = useMemo(() => {
  if (!privateIdMsg) return [];
  const privateFeed = appStore.store.feed.private[privateIdMsg];
  if (!privateFeed) return [];
  return privateFeed.order.map(id => privateFeed.byId[id]);
}, [appStore.store.feed.private, privateIdMsg]);

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
    if (appStore.store.local.matches.length > 0) return;

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
  }, [messageFeed, privateIdMsg, appStore.store.local.matches.length]);

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

  //funcion para scrollear al final, primero se verifica que referencia de feed esta activa usando container viendo si privateIdMsg es true o false, esto determina si es el feed publico o privado.
  //si container es null, no pasa nada y se retorna.
  //si container es valido, se llama a la funcion scrollTo, que tiene 2 argumentos, el top es el final del scroll, y el behavior es para que sea suave.
  //setUnreadCount(0) es para resetear el contador de mensajes no leidos
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
const privateMessages = messageFeedPriv;


  return (
    <section
      className={`${
        activeFeed
          ? "flex yellowBg justify-center items-center h-100vh "
          : "hidden"
      }`}
    >
      <InputMsgSearch/>

      {privateIdMsg ? (
        <section
          className={`h-[60vh] w-94 top-46 xl:h-[90vh] xl:w-[80vw]  absolute xl:top-1 xl:right-16.5 rounded-bl-xs rounded-br-xs 
          `}
        >
          <Image
            src={"/background-directorio.jpg"}
            width={3000}
            height={1000}
            alt="background feed chat"
            className={`w-full h-full object-cover z-0 rounded-xs`}
          ></Image>
          <h3 className="absolute -top-12 left-1 xl:top-0 rounded-b-sm bg-yellow-50/25 tracking-wider  xl:left-56 flex justify-center items-center w-44 xl:w-[50vw] h-10 text-2xl mesoninaRegular backdrop-blur-xl z-10">
            {clientSelected}
          </h3>
          <div
            className={`flex flex-col overflow-y-auto [scrollbar-gutter:stable] h-[51.5vh] xl:h-[83.7vh] absolute g-2 top-18 xl:top-11  w-94 xl:w-[79vw]`}
            ref={refMessageInFeedPrivate}
          >
            {privateMessages.map((msg) => {
              const id = msg.id.toString();
              const isMatch = appStore.store.local.matches.includes(id);
              const isActive = msg.id === activeMessageId;
              return (
                <MessageItem 
                  key={msg.id}
                  isActive={isActive}
                  isMatch={isMatch}
                  message={msg}
                  messageRefs={messageRefs}
                  myUserId={socketRef.current!.userId }
                  showAuthor={false}
                />
              );
            })}
          </div>
          {unreadCount > 0 && !isNearBottom && (
            <button 
              onClick={handleGoToBottom}
              className="absolute animate-pulse -right-3.5 xl:-right-2 -bottom-4 xl:bottom-0 m-4 rounded-xs xl:rounded-full p-1 xl:p-2 hover:cursor-pointer bg-amber-400/80 mesoninaRegular text-black font-extrabold z-8"
            >
              ↓ {unreadCount}
            </button>
          )}
        </section>
      ) : (
        //section para el feed de mensajes publicos
        <section className=" h-[60vh] w-94 top-46 xl:h-[90vh] xl:w-[80vw]  absolute xl:top-1 xl:right-16.5 rounded-sm">
          <Image
            src={"/background-directorio.jpg"}
            width={3000}
            height={1000}
            alt="background feed chat"
            className={`w-full h-full object-cover z-0 rounded-xs`}
          ></Image>
          <h3 className="absolute -top-12 left-1 xl:top-0 rounded-b-sm bg-yellow-50/25 tracking-wider xl:left-56 flex justify-center items-center w-44 xl:w-[50vw] h-10 text-2xl mesoninaRegular backdrop-blur-xl z-10">
            mensaje publico
          </h3>
          <div
            className={` flex flex-col overflow-y-auto [scrollbar-gutter:stable] h-[51.5vh]  xl:h-[83.7vh] absolute g-2 top-18 xl:top-11  w-94 xl:w-[79vw]`}
            ref={refMessageInFeedPublic}
          >
            {messageFeed.map((msg) => {
              const id = msg.id.toString();
              const isMatch = appStore.store.local.matches.includes(id);
              const isActive = msg.id === activeMessageId;
              
              return (
                <MessageItem
                  key={msg.id}
                  isActive={isActive}
                  isMatch={isMatch}
                  message={msg}
                  messageRefs={messageRefs}
                  myUserId={socketRef.current?.userId }
                  showAuthor={true}
                />
              );
            })}
          </div>
          {unreadCount > 0 && !isNearBottom && (
            <button
              onClick={handleGoToBottom}
              className="absolute animate-pulse -right-3.5 xl:-right-2 -bottom-4 xl:bottom-0 m-4 rounded-xs xl:rounded-full p-1 xl:p-2 hover:cursor-pointer bg-amber-400/80 mesoninaRegular text-black font-extrabold z-8"
            >
              ↓ {unreadCount}
            </button>
          )}
        </section>
      )}
    </section>
  );
};
