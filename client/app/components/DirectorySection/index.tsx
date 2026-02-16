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
    <section className="h-[80vh] w-full xl:flex xl:flex-col xl:w-60 xl:h-[94vh]">
      <div className="bg-black flex justify-center items-center h-20 m-1 rounded-xs">
        <h1 className="titleColor text-3xl mesoninaRegular font-bold tracking-[6px]">
          Live Chat
        </h1>
      </div>

      <div className="bg-black p-1 rounded-xs m-1 h-full flex flex-col justify-between items-start xl:items-center relative">
        
        {/*Header conectados */}
        <div className="flex flex-row justify-center items-center ml-2 xl:justify-between xl:w-53">
          <h2 className="hidden mesoninaRegular p-1 blackDeg xl:flex xl:rounded-xs xl:tracking-[3px] xl:font-bold">
            conectados
          </h2>
          <Image
            alt="icon conectados"
            src={"/icons/conectados.png"}
            width={30}
            height={30}
            className="p-2 rounded-sm xl:p-1 xl:rounded-xs"
          />
          <p className="p-2 rounded-sm xl:p-1 xl:rounded-xs">
            {conectedCount || 0}
          </p>
        </div>

        {/*Buscador */}
        <form
          className={`${
            activeFeed ? "hidden xl:flex" : ""
          } absolute w-90 h-9 top-14 left-2 flex flex-row items-center justify-center blackDeg rounded-xs xl:w-54 xl:top-24`}
        >
          <input
            onChange={changeInputSearch}
            type="text"
            className="yellowBg h-6 rounded-xs text-black px-px text-center w-full mx-1 xl:w-45 xl:h-7"
            value={inputSearch}
          />
          <Image
            alt="icon lupa"
            src={"/icons/lupa.png"}
            width={30}
            height={30}
            className="p-1 rounded-xs object-cover h-6 w-6"
          />
        </form>

        {/* Fondo */}
        <Image
          alt="bg directory"
          src={"/background-directorio.jpg"}
          width={500}
          height={200}
          className={`h-150 xl:h-150 border rounded-xs object-cover ${
            activeFeed ? "hidden xl:flex" : ""
          }`}
        />

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
