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
  const [inputSearch, setInputSearch] = useState<string>("");
  const [resSearch, setResSearch] = useState<string>("");
  const {
    conectedCount,
    nickConected,
    handleSelectClient,
    changeRegisterNick,
    inputRegister,
    registerNick,
    socketRef,
  } = useAppContextWs();

  function changeInputSearch(e: FormEvent<HTMLInputElement>) {
    let data = e.currentTarget;
    setInputSearch(data.value);
  }
  function handleInputSearch(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const res = nickConected.find((nick) => nick.nick === inputSearch);
    if (res?.nick) {
      setResSearch(res.nick);
    }
  }
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
          <form className="absolute top-20 flex flex-row items-center justify-evenly blackDeg px-px py-py rounded-xs">
            <input
              onChange={changeInputSearch}
              type="text"
              className=" yellowBg h-6 rounded "
            />
            <div className="flex justify-center items-center">
              <button onClick={handleInputSearch}>
                <Image
                  alt="icon user"
                  src={"/icons/lupa.png"}
                  width={30}
                  height={30}
                  className="p-2 rounded-xs object-cover hover:cursor-pointer"
                />
              </button>
            </div>
          </form>
          <Image
            alt="icon user"
            src={"/background-directorio.jpg"}
            width={400}
            height={100}
            className="p-2 h-140 rounded-xs object-cover"
          />
          {resSearch ? (
            <p className="border absolute top-30 p-1 bgBlurYellow text-black mesoninaRegular font-extrabold text-xl tracking-wider rounded hover:cursor-pointer h-10 flex justify-center items-center">
              {resSearch}
            </p>
          ) : (
            <div className="absolute h-80 w-full  p-1 m-4">
              {nickConected.map((nick, index) => {
                //puse este if para evitar renderizar mi propio nick
                if (nick.userId !== socketRef.current?.userId) {
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
                }
              })}
            </div>
          )}
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
          <div className="flex flex-col justify-center items-center relative">
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
