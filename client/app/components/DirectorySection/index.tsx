"use client";
import { ClientsConected } from "@/types/types";
import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { useAppContextWs } from "@/context/context";
import { NavbarChat } from "../NavbarChat";

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
      : nickConected.filter((c) => c.userId !== myId && Boolean(c.nick));

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
        c.nick?.trim().toLowerCase().includes(data.trim().toLowerCase()),
    );

    setResSearch(res);
  }

  return (
    <section className="grid col-start-auto row-start-2  md:row-start-auto md:col-start-1 md:grid-rows-[60px_1fr] md:h-full">
      <div className="flex justify-center items-center m-1">
        <h1 className="hidden md:flex titleColor text-3xl mesoninaRegular font-bold tracking-[6px]">
          Live Chat
        </h1>
      </div>

      <div className="grid grid-rows-[40px_40px_50px_1fr] h-full ">
        {/*Header conectados */}
        <div className="grid grid-cols-[112px_30px_30px] justify-evenly md:items-center">
          <h2 className=" mesoninaRegular xl:flex  tracking-[3px] xl:font-bold">
            conectados
          </h2>
          <Image
            alt="icon conectados"
            src={"/icons/conectados.png"}
            width={20}
            height={20}
            className=""
          />
          <p className="">{conectedCount || 0}</p>
        </div>

        {/*Buscador */}
        <form
          className={`${activeFeed ? "hidden md:grid" : ""}
              grid grid-cols-[1fr_25px] p-0.5 gap-1 justify-between items-center  rounded-xs`}
        >
          <input
            onChange={changeInputSearch}
            type="text"
            className="yellowBg rounded-xs text-black text-center "
            value={inputSearch}
            placeholder="Buscar"
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
            className={`bgBlurYellow text-black mesoninaRegular font-extrabold text-xl rounded-xs hover:cursor-pointer flex items-center justify-center tracking-widest h-9  ${
              activeFeed ? "hidden xl:flex " : ""
            }`}
            onClick={returnToGroup}
          >
            mensaje publico
          </button>
        )}

        {/*Lista de contactos */}
        <div
          className={` ${visibleContacts.length > 0 ? "h-full overflow-y-auto"  : ""}   ${
            activeFeed ? "hidden xl:flex flex-col" : ""
          }`}
        >
          {visibleContacts.length > 0 ? (
            visibleContacts.map((client) => {
              const meta = metadataMap[client.userId];

              return (
                <div
                  key={client.userId}
                  className={`text-black flex mt-1 ${
                    meta?.hasNewMessages && meta?.unreadCount > 0
                      ? "justify-evenly"
                      : "justify-center"
                  } items-center bgBlurYellow p-1 rounded-xs h-8 hover:cursor-pointer`}
                  onClick={() =>
                    handleSelectClient(client.userId, client.nick!)
                  }
                >
                  <p
                    className="mesoninaRegular font-extrabold text-xl h-6 flex items-center justify-center tracking-widest transition-all duration-300"
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
            <p className="p-1 bgBlurYellow text-black mesoninaRegular font-extrabold w-full text-xl rounded-xs h-6 flex items-center justify-center tracking-widest">
              esperando usuarios
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
