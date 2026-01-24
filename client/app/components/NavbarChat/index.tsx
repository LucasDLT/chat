"use client";
import Image from "next/image";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAppContextWs } from "@/context/context";
import { Section_Edit_Form } from "../Forms/Edit";
import { Logout_Button } from "@/app/components/Logout_Button";
interface NabvarProps {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  activeMobile: boolean;
  setActiveMobile: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveUser: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveFeed: React.Dispatch<React.SetStateAction<boolean>>;
  socketRef: React.RefObject<WebSocket | null>;
  activeFeed: boolean;
  router: AppRouterInstance;
}
export const NavbarChat: React.FC<NabvarProps> = ({
  active,
  activeMobile,
  setActive,
  setActiveMobile,
  setActiveFeed,
  activeFeed,
  socketRef,
  router,
  setActiveUser,
}) => {
  const { setMessageFeed, setMessageFeedPriv, setNickConected, setHasNickname, setPrivateIdMsg, setClientSelected } = useAppContextWs();
  const handleToClose = () => {
    setMessageFeed([]);
    setMessageFeedPriv([]);
    setNickConected([]);
    setHasNickname(false);
    setPrivateIdMsg(undefined);
    setClientSelected(undefined);
    setActiveUser(false);
    socketRef.current?.close();
    router.push("/");
  };
  return (
    <section
      className={`bg-black z-10 flex justify-center items-center absolute top-22 right-3  w-60 h-10 xl:flex-col xl:top-0 xl:right-0 xl:h-screen overflow-hidden ${
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
        className={`yellowBg flex justify-between items-center p-1 mt-1 h-9 w-60 rounded-sm xl:mb-2 pt-2 pb-2 xl:mt-2 xl:flex-col xl:h-full  ${
          active === false
            ? "xl:w-10 transition-all duration-100"
            : "xl:w-50 transition-all duration-100 "
        }
          ${
            activeMobile === false
              ? "transition-all duration-100"
              : "w-50 h-170 z-10 flex flex-col justify-between gap-2 items-center  transition-all duration-100 "
          }
          `}
      >
        <div className="flex flex-col justify-center items-center relative">
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

          {active && (
            <Section_Edit_Form

            />
          )}
        </div>
        <div
          className={`flex justify-center items-center ${
            active === false
              ? "bg-yellow-100 rounded-full p-p transition-all ease-in-out duration-500"
              : "hover:bg-yellow-100"
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
              active === false ? "" : "xl:top-85 absolute"
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
          className="hover:cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
        />
      </nav>
    </section>
  );
};
