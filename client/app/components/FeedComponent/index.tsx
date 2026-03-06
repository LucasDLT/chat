"use client";
import { InputMsgChat } from "@/app/components/InputMsgChat/index";
import { InputMsgSearch } from "../InputMsgSearch";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppContextWs } from "@/context/context";
import { MessageItem } from "@/app/components/msgItem";
import {
  handleUpdatePrivateData,
  handleUpdatePublicData,
  handleUpdateView,
  handleUpdateViewPublic,
} from "@/helpers/app_store/app_store_actions";
import { resolve_private_messages } from "@/helpers/messages/private_msg";
import {
  normalize_msg_private,
  normalize_msg_public,
} from "@/helpers/sockets_fn/ws_handles";
import { resolve_public_messages } from "@/helpers/messages/public_msg";
import Image from "next/image";

export const FeedSection = () => {
  const {
    activeFeed,
    privateIdMsg,
    appStore,
    messageRefs,
    socketRef,
    inputMsgSearch,
    setAppStore,
  } = useAppContextWs();

  const activeMessageId =
    appStore.store.local.matches[appStore.store.local.activeIndex];

  const refMessageInFeedPublic = useRef<HTMLDivElement | null>(null);
  const refMessageInFeedPrivate = useRef<HTMLDivElement | null>(null);

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
    if (appStore.store.feed.mode === "local") {
      let limit = appStore.store.local.offset;

      return Object.values(privateFeed.order)
        .slice(0, limit)
        .map((id) => privateFeed.byId[id])
        .sort((a, b) => a.timestamp - b.timestamp);
    } else {
      return Object.values(privateFeed.byId).sort(
        (a, b) => a.timestamp - b.timestamp,
      );
    }
  }, [
    privateFeed?.byId,
    appStore.store.local.offset,
    appStore.store.feed.mode,
    privateFeed?.order,
  ]); // clave: recalcula al pedir más

  const messageFeed = useMemo(() => {
    if (appStore.store.feed.mode === "local") {
      return Object.values(publicFeed.order)
        .slice(0, appStore.store.local.offset)
        .map((id) => publicFeed.byId[id])
        .sort((a, b) => a.timestamp - b.timestamp);
    } else {
      return Object.values(publicFeed.byId).sort(
        (a, b) => a.timestamp - b.timestamp,
      );
    }
  }, [
    publicFeed.byId,
    publicFeed.order,
    appStore.store.local.offset,
    appStore.store.feed.mode,
  ]);

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
    };

    requestAnimationFrame(handleScroll);

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [privateIdMsg]);

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
  }, [currentFeed.length, privateIdMsg, activeFeed]);

  useEffect(() => {
    hasMountedRef.current = false;
    prevLengthRef.current = 0;
  }, [privateIdMsg, activeFeed]);

  const getMoreMessages = async () => {
    if (
      appStore.store.feed.mode === "local" &&
      inputMsgSearch &&
      privateIdMsg
    ) {
      const query = inputMsgSearch.trim().toLowerCase();
      const activeIndex = appStore.store.local.activeIndex;
      const id = privateIdMsg.toString();
      setAppStore((prev) => handleUpdateView(prev, id, activeIndex, query));
    }
    if (appStore.store.feed.mode === "remote" && privateIdMsg) {
      const existing = appStore.store.feed.private[privateIdMsg];

      if (!existing?.remote.hasMore || existing.remote.loading) return;
      const offset = existing.remote.offset;
      const limit = appStore.store.remote.limit;
      const userId = privateIdMsg.toString();

      const messages = await resolve_private_messages(
        privateIdMsg,
        offset,
        limit,
      );
      const normalized = normalize_msg_private(messages);

      setAppStore((prev) => handleUpdatePrivateData(normalized, prev, userId));
    }

    if (
      appStore.store.feed.mode === "remote" &&
      appStore.store.feed.active === "public"
    ) {
      const offset = appStore.store.feed.public.remote.offset;
      const limit = appStore.store.remote.limit;
      const messages = await resolve_public_messages(offset, limit);
      const normalized = normalize_msg_public(messages);

      setAppStore((prev) => handleUpdatePublicData(normalized, prev));
    }
    if (
      appStore.store.feed.mode === "local" &&
      appStore.store.feed.active === "public" &&
      inputMsgSearch
    ) {
      const query = inputMsgSearch.trim().toLowerCase();
      setAppStore((prev) =>
        handleUpdateViewPublic(prev, appStore.store.local.activeIndex, query),
      );
    }
  };
  return (
    <section
      className={`${activeFeed ? "grid col-start-auto row-start-3 grid-rows-[45px_1fr_45px] md:row-start-auto md:col-start-2 md:h-full  md:grid-rows-[45px_1fr_45px] min-w-0 min-h-0" : "hidden"}`}
    >
      <InputMsgSearch />

      {privateIdMsg ? (
        <section className="grid grid-rows-[1fr] min-h-0 min-w-0 relative ">
          <div
            className="overflow-y-auto overscroll-contain min-h-0 min-w-0 bg-yellow-600/10 rounded-b-md flex flex-col"
            ref={refMessageInFeedPrivate}
          >
            {isAtTop && (
              <button
                onClick={getMoreMessages}
                className="absolute z-8 top-0 right-0.5 hover:cursor-pointer"
              >
                ↑
              </button>
            )}
{  /*        <Image
            src="/background-yellow.jpg"
            alt="empty feed"
            fill
            className="object-cover md:hidden z-0" />
             <Image
            src="/background-yellow-mobile.jpg"
            alt="empty feed"
            fill
            className="hidden object-cover md:block z-0" />*/}
            {privateMessages.map((msg) => {
              const id = msg.id.toString();
              const isMatch = appStore.store.local.matches.includes(id);
              const isActive = Number(msg.id) === Number(activeMessageId);
              console.log(isActive, );
              
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

          {!isAtBottom && (
            <button
              onClick={handleGoToBottom}
              className="z-8 absolute bottom-0 right-0.5 hover:cursor-pointer "
            >
              ↓
            </button>
          )}
        </section>
      ) : (
        <section className="h-full grid grid-rows-[1fr] min-h-0 min-w-0 relative">
          <div
            className="overflow-y-auto min-h-0 min-w-0 bg-yellow-600/10 rounded-b-md flex flex-col"
            ref={refMessageInFeedPublic}
          >
{  /*        <Image
            src="/background-yellow.jpg"
            alt="empty feed"
            fill
            className="object-cover md:hidden z-0" />
          <Image
            src="/background-yellow-mobile.jpg"
            alt="empty feed"
            fill
            className="hidden object-cover md:block z-0" />*/}
            {isAtTop && (
              <button
                onClick={getMoreMessages}
                className="absolute z-8 top-0 right-0.5 hover:cursor-pointer"
              >
                ↑
              </button>
            )}
            {messageFeed.map((msg) => {
              const id = msg.id.toString();
              const isMatch = appStore.store.local.matches.includes(id);
              const isActive = msg.id === Number(activeMessageId);

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

          {!isAtBottom && (
            <button
              onClick={handleGoToBottom}
              className="z-8 absolute bottom-0 right-0.5 hover:cursor-pointer "
            >
              ↓
            </button>
          )}
        </section>
      )}
      <InputMsgChat />
    </section>
  );
};
