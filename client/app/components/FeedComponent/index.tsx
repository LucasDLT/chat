"use client";
import Image from "next/image";
import { InputMsgSearch } from "../InputMsgSearch";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppContextWs } from "@/context/context";
import { MessageItem } from "@/app/components/msgItem";

export const FeedSection = () => {
  const {
    activeFeed,
    privateIdMsg,
    clientSelected,
    appStore,
    messageRefs,
    socketRef,
  } = useAppContextWs();

  const activeMessageId =
    appStore.store.local.matches[appStore.store.local.activeIndex];

  const refMessageInFeedPublic = useRef<HTMLDivElement | null>(null);
  const refMessageInFeedPrivate = useRef<HTMLDivElement | null>(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const prevLengthRef = useRef(0);

  // Feeds derivados
  const publicFeed = appStore.store.feed.public;
  const privateFeed = privateIdMsg
    ? appStore.store.feed.private[privateIdMsg]
    : null;

const privateMessages = useMemo(() => {
  if (!privateFeed) return [];
  return Object.values(privateFeed.byId).sort((a, b) => a.timestamp - b.timestamp);
}, [privateFeed?.byId]);

const messageFeed = useMemo(() => {
  return Object.values(publicFeed.byId).sort((a, b) => a.timestamp - b.timestamp);
}, [publicFeed.byId]);

const currentFeed = privateIdMsg ? privateMessages : messageFeed;

  // Control unread
  useEffect(() => {
    const prevLength = prevLengthRef.current;

    if (currentFeed.length > prevLength && !isNearBottom) {
      setUnreadCount((prev) => prev + (currentFeed.length - prevLength));
    }

    prevLengthRef.current = currentFeed.length;
  }, [currentFeed.length, isNearBottom]);

  // Scroll listener
  useEffect(() => {
    const container = privateIdMsg
      ? refMessageInFeedPrivate.current
      : refMessageInFeedPublic.current;

    if (!container) return;

    const handleScroll = () => {
      const nearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        50;
      setIsNearBottom(nearBottom);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [privateIdMsg]);

  //Scroll automático cuando llegan mensajes nuevos
  useEffect(() => {
    const container = privateIdMsg
      ? refMessageInFeedPrivate.current
      : refMessageInFeedPublic.current;

    if (!container) return;

    const feedById = privateIdMsg
      ? appStore.store.feed.private[privateIdMsg]?.byId
      : appStore.store.feed.public.byId;

    if (!feedById) return;

    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      80;
    if (nearBottom) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      setUnreadCount(0);
    }
  }, [
    privateIdMsg,
    appStore.store.feed.public.byId,
    appStore.store.feed.private[privateIdMsg ?? ""]?.byId,
  ]);

  // Scroll al mensaje activo (búsqueda)
  useEffect(() => {
    if (!activeMessageId) return;
    const el = messageRefs.current[activeMessageId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeMessageId]);

  const handleGoToBottom = () => {
    const container = privateIdMsg
      ? refMessageInFeedPrivate.current
      : refMessageInFeedPublic.current;
    if (!container) return;

    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    setUnreadCount(0);
  };

  return (
    <section
      className={`${activeFeed ? "flex yellowBg justify-center items-center h-100vh " : "hidden"}`}
    >
      <InputMsgSearch />

      {privateIdMsg ? (
        <section className="h-[60vh] w-94 top-46 xl:h-[90vh] xl:w-[80vw] absolute xl:top-1 xl:right-16.5 rounded-bl-xs rounded-br-xs">
          <Image
            src="/background-directorio.jpg"
            width={3000}
            height={1000}
            alt="background feed chat"
            className="w-full h-full object-cover z-0 rounded-xs"
          />
          <h3 className="absolute -top-12 left-1 xl:top-0 rounded-b-sm bg-yellow-50/25 tracking-wider xl:left-56 flex justify-center items-center w-44 xl:w-[50vw] h-10 text-2xl mesoninaRegular backdrop-blur-xl z-10">
            {clientSelected}
          </h3>
          <div
            className="flex flex-col overflow-y-auto [scrollbar-gutter:stable] h-[51.5vh] xl:h-[83.7vh] absolute g-2 top-18 xl:top-11 w-94 xl:w-[79vw]"
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
                  myUserId={socketRef.current!.userId}
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
        <section className="h-[60vh] w-94 top-46 xl:h-[90vh] xl:w-[80vw] absolute xl:top-1 xl:right-16.5 rounded-sm">
          <Image
            src="/background-directorio.jpg"
            width={3000}
            height={1000}
            alt="background feed chat"
            className="w-full h-full object-cover z-0 rounded-xs"
          />
          <h3 className="absolute -top-12 left-1 xl:top-0 rounded-b-sm bg-yellow-50/25 tracking-wider xl:left-56 flex justify-center items-center w-44 xl:w-[50vw] h-10 text-2xl mesoninaRegular backdrop-blur-xl z-10">
            mensaje publico
          </h3>
          <div
            className="flex flex-col overflow-y-auto [scrollbar-gutter:stable] h-[51.5vh] xl:h-[83.7vh] absolute g-2 top-18 xl:top-11 w-94 xl:w-[79vw]"
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
                  myUserId={socketRef.current?.userId}
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
