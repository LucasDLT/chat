"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppContextWs } from "@/context/context";
import { ChangeNickSection } from "@/components/ChangeNick";

export default function Chat() {
  const router = useRouter();
  const [active, setActive] = useState<boolean>(false);
  const {
    conectedCount,
    nickConected,
    handleSelectClient,
    handleActiveRegister,
    activeRegister,
    changeRegisterNick,
    inputRegister,
    registerNick,
    hasNickname,
  } = useAppContextWs();

  return (
    <main className="yellowBg h-screen flex flex-row justify-between">
      <section className="flex flex-col h-screen w-60">
        <div className="bg-black flex justify-center items-center h-18 m-1 rounded-xs">
          <h1 className="titleColor text-3xl mesoninaRegular font-bold tracking-[6px]">
            Live Chat
          </h1>
        </div>

        <div className="bg-black p-1 rounded-xs m-1 h-full flex flex-col justify-center items-center relative">
          <div className="flex flex-row justify-between w-53">
            <h2 className="blackDeg p-1 rounded-xs mesoninaRegular tracking-[3px] font-bold">
              conectados
            </h2>
            <p className="blackDeg p-1 rounded-xs ">
              {conectedCount ? conectedCount : 0}{" "}
            </p>
          </div>

          <input type="text" className="absolute yellowBg top-40 " />
          <Image
            alt="icon user"
            src={"/background-directorio.jpg"}
            width={400}
            height={100}
            className="p-2 h-140 rounded-xs object-cover"
          />
          <div className="absolute h-80 w-full border p-1 m-4">
            {nickConected.map((nick, index) => {
              return (
                <p
                  onClick={() => handleSelectClient(nick.userId, nick.nick)}
                  className="border p-1 bgBlurYellow text-black mesoninaRegular font-extrabold text-xl tracking-wider rounded hover:cursor-pointer h-10 flex justify-center items-center gap-4"
                  key={index}
                >
                  {nick.nick}
                  {nick.totalMessageIn ? `(${nick.totalMessageIn})` : ""}
                </p>
              );
            })}
          </div>
        </div>
      </section>
      <section>feed en blanco</section>
      <section
        className={`bg-black flex flex-col h-screen ${
          active === false
            ? "w-20 transition-all duration-100"
            : "w-60 transition-all duration-100"
        } items-center justify-end`}
      >
        <nav
          className={`yellowBg flex flex-col justify-between items-center h-[85vh] ${
            active === false
              ? "w-10 transition-all duration-100"
              : "w-50 transition-all duration-100 "
          } rounded-sm mb-2 pt-2 pb-2`}
        >
          <div className="flex flex-col flex-col justify-center items-center relative">
            <Image
              alt="icon user"
              src={"/icons/usuario.png"}
              width={30}
              height={30}
              onClick={() => {
                setActive(!active); //aca dejamos esta funcion para poner el setter del cambio de estado para abrir el nav y cerrarlo
              }}
              className="hover:cursor-pointer"
            />

          { active && <ChangeNickSection
              onChange={changeRegisterNick}
              value={inputRegister ? inputRegister : ""}
              onSubmit={registerNick}
            />}

          </div>
          <Image
            alt="icon chat"
            src={"/icons/chat.png"}
            width={25}
            height={25}
            onClick={() => {
              router.push("/chat");
              setActive(false);
            }}
            className="hover:cursor-pointer"
          />
          <Image
            alt="icon arrow"
            src={"/icons/flecha-izquierda.png"}
            width={20}
            height={20}
            onClick={() => {
              router.push("/");
            }}
            className="hover:cursor-pointer"
          />
        </nav>
      </section>
    </main>
  );
}
