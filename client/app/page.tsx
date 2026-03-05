"use client";
import { useRouter } from "next/navigation";
import { useAppContextWs } from "@/context/context";

export default function Home() {
  const { user } = useAppContextWs();
  const router = useRouter();

  return (
    <div className="grid grid-rows-[1fr_300px] grid-cols-1 justify-between items-center yellowBg h-dvh">
      <div className="gap-20 flex flex-col md:flex-row justify-center items-center mesoninaRegular text-black font-bold tracking-widest h-full">
        <button
          onClick={() => router.push("/forms")}
          className={`bg-[#d4ab4a78] rounded
          p-1 h-15 w-60 md:w-30 md:h-10  ${
            user === null
              ? `hover:cursor-pointer
           hover:scale-96 
          shadow-[0_2px_1px_0px_rgba(0,0,0,0.3)]
          hover:shadow-[0_0px_0px_0px_rgba(0,0,0,0.5)]
          transition-all ease-in-out`
              : `bg-grey hover:none`
          }`}
        >
          Forms
        </button>
        <button
          onClick={() => router.push("/chat")}
          className={`bg-[#d4ab4a78]
          p-1 h-15 w-60 md:w-30 md:h-10 
          rounded  ${
            user === null
              ? ""
              : ` hover:cursor-pointer hover:scale-96 
          shadow-[0_2px_1px_0px_rgba(0,0,0,0.3)]
          hover:shadow-[0_0px_0px_0px_rgba(0,0,0,0.5)]
          transition-all ease-in-out`
          }`}
        >
          Rooms
        </button>

      </div>
      <section className="bg-black flex flex-col w-full h-full justify-center items-center  ">
        <h1 className=" titleColor odor tracking-widest text-6xl md:text-5xl  ">
          SocketHub
        </h1>
        <p className="text-center text-[14px]">
          Nota: el servidor se encuentra alojado en free tier de render.com, por lo que puede requerir unos segundos para activarse en el primer acceso. 
        </p>
      </section>
    </div>
  );
}
