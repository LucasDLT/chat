"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAppContextWs } from "@/context/context";
import { ClientsConected } from "@/types/types";
import { DirectorySection } from "@/components/DirectorySection";
import { NavbarChat } from "@/components/NavbarChat";

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
        nick.nick.trim().toLowerCase().includes(data.trim().toLowerCase())
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
      />
      <section className={`${activeFeed ? "flex" : "hidden"}`}>
        feed en blanco
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
