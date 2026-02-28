"use client";
import { ClientsConected } from "@/types/types";
import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { useAppContextWs } from "@/context/context";

export const DirectorySection = () => {
  const [resSearch, setResSearch] = useState<ClientsConected[]>([]);

  const {
    activeFeed,
    appStore,
    inputSearch,
    handleSelectClient,
    socketRef,
    setInputSearch,
    returnToGroup,
  } = useAppContextWs();

  const conectedCount = appStore.clients.length;
  const nickConected = appStore.clients;
  const myId = socketRef.current?.userId;

  // Contactos visibles
  const visibleContacts =
    resSearch.length > 0
      ? resSearch
      : nickConected.filter(
          (c) => c.userId !== myId && Boolean(c.nick)
        );

  //Creamos un mapa eficiente de metadata por userId
  const metadataMap = useMemo(() => {
    return appStore.inboxMeta;
  }, [appStore.inboxMeta]);

  function changeInputSearch(e: FormEvent<HTMLInputElement>) {
    const data = e.currentTarget.value;
    setInputSearch(data);

    const res = nickConected.filter(
      (c) =>
        c.userId !== myId &&
        c.nick?.trim().toLowerCase().includes(data.trim().toLowerCase())
    );

    setResSearch(res);
  }

  return (
    <section className="grid col-start-1 grid-rows-[60px_1fr] border h-full ">
      <div className="bg-black flex justify-center items-center m-1">
        <h1 className="titleColor text-3xl mesoninaRegular font-bold tracking-[6px]">
          Live Chat
        </h1>
      </div>

      <div className="grid grid-rows-[40px_40px_1fr_1fr] gap-1">
        
        {/*Header conectados */}
        <div className="grid grid-cols-[112px_30px_30px] justify-around items-center border">
          <h2 className="hidden mesoninaRegular xl:block tracking-[3px] xl:font-bold">
            conectados
          </h2>
          <Image
            alt="icon conectados"
            src={"/icons/conectados.png"}
            width={20}
            height={20}
            className=""
          />
          <p className="">
            {conectedCount || 0}
          </p>
        </div>

        {/*Buscador */}
        <form
          className={`${
            activeFeed ? "hidden md:grid" : ""}
              grid grid-cols-[1fr_25px] p-0.5 gap-1 justify-between items-center border rounded-xs`}
        >
          <input
            onChange={changeInputSearch}
            type="text"
            className="yellowBg rounded-xs text-black text-center "
            value={inputSearch}
            placeholder="buscar"
          />
          <Image
            alt="icon lupa"
            src={"/icons/lupa.png"}
            width={20}
            height={20}
            className="object-cover"
          />
        </form>

        {/* Fondo */}
       {/* <Image
          alt="bg directory"
          src={"/background-directorio.jpg"}
          fill
          className={` object-cover ${
            activeFeed ? "hidden xl:flex" : ""
          }`}
        />
*/}
        {/*Botón grupo */}
        {visibleContacts.length > 0 && (
          <button
            className={`absolute top-30 xl:top-40 left-2 p-1 my-1 bgBlurYellow w-90 xl:w-54 text-black mesoninaRegular font-extrabold text-xl rounded-xs hover:cursor-pointer h-6 flex items-center justify-center tracking-widest ${
              activeFeed ? "hidden xl:flex" : ""
            }`}
            onClick={returnToGroup}
          >
            mensaje publico
          </button>
        )}

        {/*Lista de contactos */}
        <div
          className={`absolute ${
            visibleContacts.length > 0
              ? "top-40 xl:top-50"
              : "top-30"
          } left-2 flex flex-col justify-start items-center w-90 xl:w-54 h-110 overflow-y-auto ${
            activeFeed ? "hidden xl:flex" : ""
          }`}
        >
          {visibleContacts.length > 0 ? (
            visibleContacts.map((client) => {
              const meta = metadataMap[client.userId];

              return (
                <div
                  key={client.userId}
                  className={`text-black flex ${
                    meta?.hasNewMessages && meta?.unreadCount > 0
                      ? "justify-evenly"
                      : "justify-center"
                  } items-center bgBlurYellow w-full p-1 my-1 rounded-xs`}
                >
                  <p
                    onClick={() =>
                      handleSelectClient(client.userId, client.nick!)
                    }
                    className="mesoninaRegular font-extrabold text-xl hover:cursor-pointer h-6 flex items-center justify-center tracking-widest transition-all duration-300"
                  >
                    {client.nick}
                  </p>

                  <p
                    className={`rounded-full yellowBg w-6 h-6 flex items-center justify-center transition-all duration-300 ease-in-out
                    ${
                      meta?.hasNewMessages
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0 pointer-events-none"
                    }`}
                  >
                    {meta?.unreadCount || ""}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="p-1 bgBlurYellow text-black mesoninaRegular font-extrabold text-xl rounded-xs h-6 flex items-center justify-center tracking-widest w-full mt-6 xl:text-sm">
              no hay usuarios conectados
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
