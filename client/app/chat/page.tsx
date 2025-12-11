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
    <main className="yellowBg h-[92vh] w-full flex flex-col xl:h-screen xl:flex-row relative xl:justify-between">
      <DirectorySection
        activeFeed={activeFeed}
        conectedCount={conectedCount}
        onChange={changeInputSearch}
        inputSearch={inputSearch}
        visibleContacts={visibleContacts}
        handleSelectClient={handleSelectClient}
        onClick={returnToGroup}

      />
      <section className={`${activeFeed ? "flex yellowBg justify-center items-center h-100vh w-screen" : "hidden"}`}>
        {privateIdMsg ? (
          <section className="h-[90vh] w-[79vw]  absolute top-0 right-19 rounded-bl-xs rounded-br-xs">
            <Image
              src={'/background-directorio.jpg'}
              width={3000}
              height={1000}
              alt="background feed chat"
              className="w-full h-full object-cover z-0 rounded-bl-xs rounded-br-xs"
            ></Image>
            <h3 className="absolute top-2 left-34 flex justify-center items-center w-[50vw] h-10   text-2xl mesoninaRegular backdrop-blur-xl z-10">{clientSelected}</h3>
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
          <section className="h-[90vh] w-[79vw]  absolute top-0  right-19 rounded-bl-xs rounded-br-xs ">
            <Image
              src={'/background-directorio.jpg'}
              width={3000}
              height={1000}
              alt="background feed chat"
              className="w-full h-full object-cover z-0 rounded-bl-xs rounded-br-xs"
            ></Image>
            <h3 className="absolute top-2 left-34 flex justify-center items-center w-[50vw] h-10   text-2xl mesoninaRegular backdrop-blur-xl z-10">mensaje publico</h3>
            <div className="grid grid-cols-1 gap-2 overflow-y-auto h-[84vh] absolute top-10 z-10 w-full">
              {messageFeed.map((msg, index) => {
                return (
                  <p key={index} className="border bg-gray-800">
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
