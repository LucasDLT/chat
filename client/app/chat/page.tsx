"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAppContextWs } from "@/context/context";
import { ClientsConected } from "@/types/types";
import { DirectorySection } from "@/components/DirectorySection";
import { NavbarChat } from "@/components/NavbarChat";
import Image from "next/image";

export default function Chat() {
  const router = useRouter();
  const [active, setActive] = useState<boolean>(false);
  const [activeMobile, setActiveMobile] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [resSearch, setResSearch] = useState<ClientsConected[]>([]);
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

  return (
    <main className="yellowBg h-[92vh] w-full flex flex-col xl:h-screen xl:flex-row relative xl:justify-between ">
      <DirectorySection
        activeFeed={activeFeed}
        conectedCount={conectedCount}
        onChange={changeInputSearch}
        inputSearch={inputSearch}
        visibleContacts={visibleContacts}
        handleSelectClient={handleSelectClient}
        onClick={returnToGroup}
      />
      <section className={`${activeFeed ? "flex yellowBg justify-center items-center h-100vh " : "hidden"}`}>
        {privateIdMsg ? (
          <section className={`h-[65vh] w-95 top-46 xl:h-[90vh] xl:w-[80vw]  absolute xl:top-1 xl:right-16.5 rounded-bl-xs rounded-br-xs ${activeMobile?"xl:w-[55vw]":""}`}>
            <Image
              src={'/background-directorio.jpg'}
              width={3000}
              height={1000}
              alt="background feed chat"
              className={`w-full h-full object-cover z-0 rounded-xs`}
            ></Image>
            <h3 className="absolute top-5 left-25 xl:top-0 rounded-b-sm bg-yellow-50/25 tracking-wider  xl:left-56 flex justify-center items-center w-60 xl:w-[50vw] h-10 text-2xl mesoninaRegular backdrop-blur-xl z-10">{clientSelected}</h3>
            <div className="grid grid-cols-1 gap-2 z-10">
              {messageFeedPriv.map((msg, index) => {
                return (
                  <p key={index} className="border bg-gray-800">
                    {msg}
                  </p>
                );
              })}
            </div>
          </section>
        ) : (
          //section para el feed de mensajes publicos
          <section className=" h-[65vh] w-95 top-46 xl:h-[90vh] xl:w-[80vw]  absolute xl:top-1 xl:right-16.5 rounded-sm">
            <Image
              src={'/background-directorio.jpg'}
              width={3000}
              height={1000}
              alt="background feed chat"
              className={`w-full h-full object-cover z-0 rounded-xs`}
            ></Image>
            <h3 className="absolute top-5 left-25 xl:top-0 rounded-b-sm bg-yellow-50/25 tracking-wider xl:left-56 flex justify-center items-center w-60 xl:w-[50vw] h-10 text-2xl mesoninaRegular backdrop-blur-xl z-10">mensaje publico</h3>
            <div className={` flex flex-col items-center overflow-y-auto h-[40vh] xl:h-[84vh] absolute g-2 top-14 xl:top-11  w-94 xl:w-[79vw]`}>
              {messageFeed.map((msg, index) => {
                return (
                  <p key={index} className="text-center mt-2 xl:mt-2 ">
                    {msg}
                  </p>
                );
              })}
            </div>
          </section>
        )}
      </section>

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
      />
    </main>
  );
}
