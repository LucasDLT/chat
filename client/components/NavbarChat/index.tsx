import Image from "next/image";
import { ChangeNickSection } from "@/components/ChangeNick";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface NabvarProps {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  activeMobile: boolean;
  setActiveMobile: React.Dispatch<React.SetStateAction<boolean>>;
  changeRegisterNick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRegister: string | undefined;
  registerNick: (e: React.FormEvent<HTMLFormElement>) => void;
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
  changeRegisterNick,
  inputRegister,
  registerNick,
  setActiveFeed,
  activeFeed,
  socketRef,
  router,
}) => {
  return (
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
            activeFeed ? setActiveFeed(false) : router.push("/");
          }}
          className="hover:cursor-pointer"
        />
      </nav>
    </section>
  );
};
