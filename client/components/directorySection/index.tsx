'use client'
import { ClientsConected } from "@/types/types";
import Image from "next/image"
import { ChangeEventHandler } from "react";

interface DirectoryProps{
    activeFeed:boolean;
    conectedCount:number;
    onChange:ChangeEventHandler<HTMLInputElement>;
    inputSearch:string|undefined;
    visibleContacts:ClientsConected[];
    handleSelectClient: (userId: string, nick: string) => void;
}
export const DirectorySection:React.FC<DirectoryProps>=({activeFeed,conectedCount,onChange,inputSearch,visibleContacts,handleSelectClient})=>{    
   return (  <section className={`${activeFeed?'hidden':'flex flex-col h-screen w-full  xl:w-60 '}`}>
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
              onChange={onChange}
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
     )}