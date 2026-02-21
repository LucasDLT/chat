"use client";
import { InputMsgChat } from "@/app/components/InputMsgChat/index";
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
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isAtTop, setIsAtTop] = useState(false);
 // const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);



  const prevLengthRef = useRef(0);

  const publicFeed = appStore.store.feed.public;
  const privateFeed = privateIdMsg
    ? appStore.store.feed.private[privateIdMsg]
    : null;

  const privateMessages = useMemo(() => {
    if (!privateFeed) return [];
    return Object.values(privateFeed.byId).sort(
      (a, b) => a.timestamp - b.timestamp,
    );
  }, [privateFeed?.byId]);

  const messageFeed = useMemo(() => {
    return Object.values(publicFeed.byId).sort(
      (a, b) => a.timestamp - b.timestamp,
    );
  }, [publicFeed.byId]);

  const currentFeed = privateIdMsg ? privateMessages : messageFeed;

  const getContainer = () =>
    privateIdMsg
      ? refMessageInFeedPrivate.current
      : refMessageInFeedPublic.current;

  // SCROLL DETECTOR REAL
  useEffect(() => {
    const container = getContainer();
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      const atTop = scrollTop <= 5;

      const atBottom = scrollHeight - scrollTop - clientHeight <= 5;

      setIsAtTop(atTop);
      setIsAtBottom(atBottom);

      // Si el usuario baja manualmente al fondo → limpiar unread
      if (atBottom) {
        setUnreadCount(0);
      }
    };

    requestAnimationFrame(handleScroll);

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [privateIdMsg]);

  // CONTROL UNREAD 
  useEffect(() => {
    const prevLength = prevLengthRef.current;

    if (currentFeed.length > prevLength) {
      const newMessages = currentFeed.slice(prevLength);
      const myUserId = socketRef.current?.userId;
      const foreignMessages = newMessages.filter((m) => m.fromId !== myUserId);
      if (!isAtBottom && foreignMessages.length > 0) {
        setUnreadCount((prev) => prev + foreignMessages.length);
      }
    }

    prevLengthRef.current = currentFeed.length;
  }, [currentFeed.length, isAtBottom]);

  // Scroll a mensaje buscado
  useEffect(() => {
    if (!activeMessageId) return;
    const el = messageRefs.current[activeMessageId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeMessageId]);

  const handleGoToBottom = () => {
    const container = getContainer();
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });

    setUnreadCount(0);
  };
useEffect(() => {
  const container = getContainer();
  if (!container) return;

  if (hasMountedRef.current) return;
  if (currentFeed.length === 0) return;

  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight;
    hasMountedRef.current = true;
  });
}, [currentFeed.length, privateIdMsg]);
useEffect(() => {
  hasMountedRef.current = false;
  prevLengthRef.current = 0;
  setUnreadCount(0);
}, [privateIdMsg]);
  return (
    <section
      className={`${activeFeed ? " border border-amber-50 h-full grid grid-rows-[45px_1fr_45px] min-w-0 min-h-0" : "hidden"}`}
    >
      <InputMsgSearch />

      {privateIdMsg ? (
        <section className="h-full grid grid-rows-[1fr] min-h-0 relative">
         



          <div
            className="overflow-y-auto min-h-0  bg-blue-800 flex flex-col"
            ref={refMessageInFeedPrivate}
          >
            {isAtTop && (
              <div className="absolute z-8 top-0 right-4">
                ↑
              </div>
            )}

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

          {unreadCount > 0 && !isAtBottom && (
            <button
              onClick={handleGoToBottom}
              className="z-8 absolute bottom-0 right-0 hover:cursor-pointer "
            >
              ↓ {unreadCount}
            </button>
          )}
          
        </section>
      ) : (
        <section className="">
          

          <h3 className="z-10">
            mensaje publico
          </h3>

          <div
            className=""
            ref={refMessageInFeedPublic}
          >
            {isAtTop && (
              <div className="z-8">
                ↑
              </div>
            )}

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

          {unreadCount > 0 && !isAtBottom && (
            <button
              onClick={handleGoToBottom}
              className="z-8 absolute"
            >
              ↓ {unreadCount}
            </button>
          )}
        </section>
      )}
            <InputMsgChat />

    </section>
    
  );
};
