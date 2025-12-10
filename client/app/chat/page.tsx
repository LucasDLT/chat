"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAppContextWs } from "@/context/context";
import { ChangeNickSection } from "@/components/ChangeNick";
import { ClientsConected } from "@/types/types";

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
    setActiveFeed
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
      <section className={`${activeFeed?'hidden':'flex flex-col h-screen w-full  xl:w-60 '}`}>
        <div className="bg-black flex justify-center items-center h-18 m-1 rounded-xs">
          <h1 className="titleColor text-3xl mesoninaRegular font-bold tracking-[6px]">
            Live Chat
          </h1>
        </div>

        <div className="bg-black p-1 rounded-xs m-1 h-full flex flex-col justify-between items-start  xl:items-center relative">
          <div className="flex flex-row justify-center items-center ml-2 xl:justify-between xl:w-53">
            <h2 className="hidden mesoninaRegular p-1 blackDeg xl:flex xl:rounded-xs  xl:tracking-[3px] xl:font-bold">
              conectados
            </h2>
            <Image alt="icon user" src={"/icons/conectados.png"} width={30} height={30} className="p-2 rounded-sm xl:p-1 xl:rounded-xs  "></Image>
            <p className="p-2 rounded-sm  xl:p-1 xl:rounded-xs  ">
              {conectedCount ? conectedCount : 0}
            </p>
          </div>
          <form className="absolute w-90 h-9 top-30 left-2 flex flex-row items-center justify-center blackDeg py-py rounded-xs g-1 xl:w-54 xl:top-24 ">
            <input
              onChange={changeInputSearch}
              type="text"
              className=" yellowBg h-6 rounded-xs text-black px-px text-center w-full mx-1 xl:w-45 xl:h-7"
              value={inputSearch}
            />
                <Image
                  alt="icon user"
                  src={"/icons/lupa.png"}
                  width={30}
                  height={30}
                  className="p-1 rounded-xs object-cover h-6 w-6"
                />
          </form>
          <Image
            alt="icon user"
            src={"/background-directorio.jpg"}
            width={500}
            height={200}
            className="h-140 border rounded-xs object-cover"
          />
          <div className="absolute top-40 left-2 flex flex-col justify-start items-center w-90 xl:w-54  h-110 xl:left-2 overflow-y-auto ">
            {visibleContacts.length > 0 ? (
              visibleContacts.map((client) => ( 
                <p
                  key={client.userId} 
                  onClick={() => handleSelectClient(client.userId, client.nick)}
                  className=" p-1 my-1 bgBlurYellow w-full text-black mesoninaRegular font-extrabold text-xl rounded-xs hover:cursor-pointer h-6 flex items-center justify-center tracking-widest"
                >
                  {client.nick}
                  {client.totalMessageIn ? ` (${client.totalMessageIn})` : ""}
                </p>
              ))
            ) : (
              <p className="p-1 bgBlurYellow text-black mesoninaRegular font-extrabold text-xl rounded-xs hover:cursor-pointer h-6 flex items-center justify-center tracking-widest w-full xl:text-sm">
                no hay usuarios conectados 
              </p>
            )}
          </div>
        </div>
      </section>
     
      <section className={`${activeFeed?'flex':'hidden'}`}>feed en blanco</section>

      <section
        className={`bg-black flex justify-center items-center absolute top-20 right-3  w-60 h-10 xl:flex-col xl:top-0 xl:right-0 xl:h-screen overflow-hidden ${
          active === false
            ? "xl:w-15 transition-all duration-100"
            : "xl:w-60 transition-all duration-100"
        } 
         ${
            activeMobile === false
              ? "transition-all duration-100"
              : "w-screen h-[92.1vh] top-[-1] right-[-0.1] z-9 flex flex-col justify-between items-center transition-all duration-100 "
          }`}
      >
        <nav
          className={`yellowBg flex justify-between items-center p-1 mt-2 h-9 w-60 rounded-sm xl:mb-2 pt-2 pb-2 xl:flex-col xl:h-full  ${
            active === false
              ? "xl:w-10 transition-all duration-100"
              : "xl:w-50 transition-all duration-100 "
          }
          ${
            activeMobile === false
              ? "transition-all duration-100"
              : "w-50 h-170 z-10 flex flex-col justify-evenly gap-2 items-center  transition-all duration-100 "
          }
          `}
        >
          <div className="flex flex-col justify-center items-center relative">
            <Image
              alt="icon user"
              src={"/icons/usuario.png"}
              width={30}
              height={30}
              onClick={() => {
                setActive(!active); //aca dejamos esta funcion para poner el setter del cambio de estado para abrir el nav y cerrarlo
                setActiveMobile(!activeMobile);
              }}
              className="hover:cursor-pointer"
            />

            {active && (
              <ChangeNickSection
                onChange={changeRegisterNick}
                value={inputRegister ? inputRegister : ""}
                onSubmit={registerNick}
                name={
                  socketRef.current?.nickname ? socketRef.current.nickname : ""
                }
              />
            )}
          </div>
          <Image
            alt="icon chat"
            src={"/icons/chat.png"}
            width={25}
            height={25}
            onClick={() => {
              router.push("/chat");
              setActive(false);
              setActiveMobile(false);
            }}
            className="hover:cursor-pointer"
          />
          <Image
            alt="icon arrow"
            src={"/icons/flecha-izquierda.png"}
            width={20}
            height={20}
            onClick={() => {
              activeFeed
              ?setActiveFeed(false)
              :router.push("/")
            }}
            className="hover:cursor-pointer"
          />
        </nav>
      </section>
    </main>
  );
}
