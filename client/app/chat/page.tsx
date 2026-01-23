"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAppContextWs } from "@/context/context";
import { DirectorySection } from "@/app/components/DirectorySection/index";
import { NavbarChat } from "@/app/components/NavbarChat/index";
import { FeedSection } from "@/app/components/FeedComponent/index";
import { InputMsgChat } from "@/app/components/InputMsgChat/index";
import { resolve_request_me } from "@/helpers/me";
import { User } from "@/types/types";

export default function Chat() {
  const router = useRouter();
  const [active, setActive] = useState<boolean>(false);
  const [activeMobile, setActiveMobile] = useState<boolean>(false);
  const {
    conectedCount,
    nickConected,
    handleSelectClient,
    socketRef,
    activeFeed,
    setActiveFeed,
    privateIdMsg,
    clientSelected,
    messageFeed,
    messageFeedPriv,
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
    activeUser,
    setActiveUser,
    hasNickname,
    user,
    setUser,
  } = useAppContextWs();



  const veryfy_user = async () => {
    try {
      const user_refresh: User = await resolve_request_me();
      console.log(user_refresh, "en verify");

      if (user_refresh !== null) {
        setUser(user_refresh);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user !== null) return; //verifico si usuario es diferente a null quiere decir que posee datos, no necesitamos verificarlos con /me y corto la ejecucion del efecto

    veryfy_user();
  }, [user]);
  
  return (
    <main className="yellowBg h-[92vh] w-full flex flex-col xl:h-screen xl:flex-row relative xl:justify-between ">
      <DirectorySection/>

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
        setActiveFeed={setActiveFeed}
        activeFeed={activeFeed}
        socketRef={socketRef}
        router={router}
        setActiveUser={setActiveUser}
      />
    </main>
  );
}
