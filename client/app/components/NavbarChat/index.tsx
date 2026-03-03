"use client";
import Image from "next/image";
import { useAppContextWs } from "@/context/context";
import { Section_Edit_Form } from "../Forms/Edit";
import { Logout_Button } from "@/app/components/Logout_Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_STATE } from "@/types/types";

export const NavbarChat = () => {
  const router = useRouter();
  const [activeMobile, setActiveMobile] = useState<boolean>(false);
  const {
    active,
    setActive,
    setAppStore,
    setHasNickname,
    setPrivateIdMsg,
    setClientSelected,
    setActiveFeed,
    activeFeed,
    socketRef,
    setActiveUser,
  } = useAppContextWs();
  const handleToClose = () => {
    setAppStore(INITIAL_STATE);
    setHasNickname(false);
    setPrivateIdMsg(undefined);
    setClientSelected(undefined);
    setActiveUser(false);
    socketRef.current?.close();
    router.push("/");
  };
  return (
    <section
      className={`grid h-full overflow-hidden col-start-auto row-start-3 md:row-start-auto md:col-start-3 md:justify-center md:relative 
         ${
           activeMobile === false
             ? ""
             : "flex flex-col justify-between items-center"
         }`}
    >
      <nav
        className={`yellowBg grid grid-cols-[30px_30px_30px_30px] items-center justify-around md:grid-cols-1
    md:justify-items-center
    md:gap-6 rounded h-[680px]${
      active === false
        ? "transition-all duration-300"
        : "transition-all duration-300 "
    }
          ${
            activeMobile === false
              ? "transition-all duration-300"
              : "rounded h-[680px] z-10 flex flex-col justify-between gap-2 items-center  transition-all duration-300 "
          }
          `}
      >
        <div className="flex flex-col justify-center items-center">
          <Image
            title="cambiar nickname"
            alt="icon user"
            src={"/icons/usuario.png"}
            width={30}
            height={30}
            onClick={() => {
              setActive(!active);
              setActiveMobile(!activeMobile);
            }}
            className={`hover:cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 rounded-full ${
              active === false
                ? ""
                : "bg-yellow-100 hover:bg-transparent p-p transition-all ease-in-out duration-500 rounded-full"
            }`}
          />

          {active && <Section_Edit_Form />}
        </div>
        <div
          className={`flex justify-center items-center ${
            active === false
              ? " rounded-full p-p transition-all ease-in-out duration-500"
              : ""
          }`}
        >
          <Image
            title="ir al chat"
            alt="icon chat"
            src={"/icons/chat.png"}
            width={25}
            height={25}
            onClick={() => {
              router.push("/chat");
              setActive(false);
              setActiveMobile(false);
            }}
            className={`hover:cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 ${
              active === false ? "" : ""
            }`}
          />
        </div>
        <Logout_Button />

        <Image
          title="regresar atras"
          alt="icon arrow"
          src={"/icons/flecha-izquierda.png"}
          width={20}
          height={20}
          onClick={() => {
            activeFeed ? setActiveFeed(false) : handleToClose();
          }}
          className="hover:cursor-pointer flex justify-center items-center hover:scale-110 transition-all ease-in-out duration-300"
        />
      </nav>
    </section>
  );
};
