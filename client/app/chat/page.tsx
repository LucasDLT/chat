"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAppContextWs } from "@/context/context";
import { DirectorySection } from "@/app/components/DirectorySection/index";
import { NavbarChat } from "@/app/components/NavbarChat/index";
import { FeedSection } from "@/app/components/FeedComponent/index";
import { InputMsgChat } from "@/app/components/InputMsgChat/index";

export default function Chat() {
  const router = useRouter();
  const [active, setActive] = useState<boolean>(false);
  const [activeMobile, setActiveMobile] = useState<boolean>(false);
  const {
    conectedCount,
    nickConected,
    handleSelectClient,
    changeRegisterNick,
    inputRegister,
    registerNick,
    socketRef,
    activeFeed,
    setActiveFeed,
    privateIdMsg,
    clientSelected,
    messageFeed,
    messageFeedPriv,
    returnToGroup,
    changeInputMessage,
    inputMsg,
    sendMessage,
    sendMessagePrivate,
    inputMsgSearch,
    handleSearchMsg,
    onChangeSearchMsgFeed,
    resMsgSearch,
    activeMatchIndex,
    searchMatches,
    setActiveMatchIndex,
    messageRefs,
    inputSearch,
    setInputSearch,
    resSearch,
    setResSearch,
    setActiveRegister,
    hasNickname
  } = useAppContextWs();

  const myId = socketRef.current?.userId;

  const visibleContacts =
    resSearch.length > 0
      ? resSearch
      : nickConected.filter((c) => c.userId !== myId && Boolean(c.nick));

  function changeInputSearch(e: FormEvent<HTMLInputElement>) {
    const data = e.currentTarget.value;
    setInputSearch(data);
    const res = nickConected.filter(
      (nick) =>
        nick.userId !== socketRef.current?.userId &&
        nick.nick?.trim().toLowerCase().includes(data.trim().toLowerCase())
    );
    setResSearch(res);
  }

  useEffect(() => {
  if (!hasNickname) {
    router.replace("/");
  }
}, [hasNickname]);

  return (
    <main className="yellowBg h-[88vh] w-full flex flex-col xl:h-screen xl:flex-row relative xl:justify-between ">
      <DirectorySection
        activeFeed={activeFeed}
        conectedCount={conectedCount}
        onChange={changeInputSearch}
        inputSearch={inputSearch}
        visibleContacts={visibleContacts}
        handleSelectClient={handleSelectClient}
        onClick={returnToGroup}
      />

      <FeedSection
        activeFeed={activeFeed}
        privateIdMsg={privateIdMsg}
        messageFeed={messageFeed}
        messageFeedPriv={messageFeedPriv}
        clientSelected={clientSelected}
        inputMsgSearch={inputMsgSearch}
        onChange={onChangeSearchMsgFeed}
        handleSearchMsg={handleSearchMsg}
        resMsgSearch={resMsgSearch}
        activeIndex={activeMatchIndex}
        matches={searchMatches}
        setActiveIndex={setActiveMatchIndex}
        messageRefs={messageRefs}
        socketRef={socketRef}
      />
      <InputMsgChat
        changeInputMessage={changeInputMessage}
        inputMsg={inputMsg}
        privateIdMsg={privateIdMsg}
        sendMessage={sendMessage}
        sendMessagePrivate={sendMessagePrivate}
        activeFeed={activeFeed}
      />
      <NavbarChat
        active={active}
        activeMobile={activeMobile}
        setActive={setActive}
        setActiveMobile={setActiveMobile}
        changeRegisterNick={changeRegisterNick}
        inputRegister={inputRegister}
        registerNick={registerNick}
        setActiveFeed={setActiveFeed}
        activeFeed={activeFeed}
        socketRef={socketRef}
        router={router}
        setActiveRegister={setActiveRegister}
      />
    </main>
  );
}
