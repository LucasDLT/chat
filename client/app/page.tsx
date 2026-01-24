'use client';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-between items-center yellowBg h-screen">
        <div className="gap-10 flex justify-center items-center mesoninaRegular text-black font-bold tracking-widest">
          <button onClick={() => router.push("/forms")} className="hover:cursor-pointer border p-1 border-amber-950">ingresar</button>
          <button onClick={() => router.push("/chat")}  className="hover:cursor-pointer border p-1 border-amber-950">ir al chat</button>
        </div>
      <section className="bg-black flex justify-center items-center h-[40vh] w-full xl:h-[40vh] xl:w-full ">
        <h1 className="mesoninaRegular titleColor font-bold tracking-wider text-7xl xl:text-7xl">
          LIVE CHAT
        </h1>
      </section>
    </div>
  );
}
