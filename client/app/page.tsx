"use client";
import { useRouter } from "next/navigation";
import { useAppContextWs } from "@/context/context";

export default function Home() {
  const { user } = useAppContextWs();
  const router = useRouter();
  console.log(user);
  
  return (
    <div className="grid grid-rows-[1fr_300px] grid-cols-1 justify-between items-center yellowBg h-dvh">
      <div className="gap-20 flex justify-center items-center mesoninaRegular text-black font-bold tracking-widest h-full">
        <button
          onClick={() => router.push("/forms")}
          className={`bg-[#d4ab4a78] rounded
          p-1 h-10 w-30  ${user === null ? `hover:cursor-pointer
           hover:scale-96 
          shadow-[0_2px_1px_0px_rgba(0,0,0,0.3)]
          hover:shadow-[0_0px_2px_0px_rgba(0,0,0,0.5)]
          transition-all ease-in-out` : `bg-grey hover:none`}`}
        >
          Login
        </button>
        <button
          onClick={() => router.push("/chat")}
          className= {`bg-[#d4ab4a78]
          p-1 h-10 w-30 
          rounded  ${user === null ? "" : ` hover:cursor-pointer hover:scale-96 
          shadow-[0_2px_1px_0px_rgba(0,0,0,0.3)]
          hover:shadow-[0_0px_2px_0px_rgba(0,0,0,0.5)]
          transition-all ease-in-out`}`}
        >
          Salas
        </button>
      </div>
      <section className="bg-black flex w-full h-full justify-center items-center  ">
        <h1 className="mesoninaRegular titleColor font-bold tracking-wider text-7xl xl:text-7xl">
          LIVE CHAT
        </h1>
      </section>
    </div>
  );
}
