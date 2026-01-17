'use client'
import { RegisterNickSection } from "@/app/components/RegisterSection";

export default function Home() {

  return (
    <div className="flex flex-col justify-between items-center yellowBg h-screen">
      <a href="http://localhost:3001/auth/google">Google</a>
      <RegisterNickSection/>
      <section className="bg-black flex justify-center items-center h-[40vh] w-full xl:h-[40vh] xl:w-full ">
        <h1 className="mesoninaRegular titleColor font-bold tracking-wider text-7xl xl:text-7xl">
          LIVE CHAT
        </h1>
      </section>
    </div>
  );
}
