'use client'
import { RegisterNickSection } from "@/app/components/RegisterSection";
import { useAppContextWs } from "@/context/context";


export default function Home() {
  const {
    handleActiveRegister,
    activeRegister,
    changeRegisterNick,
    inputRegister,
    registerNick,
  } = useAppContextWs();

  return (
    <div className="flex flex-col justify-between items-center yellowBg h-screen">
      <RegisterNickSection
        onClick={handleActiveRegister}
        activeRegister={activeRegister}
        onChange={changeRegisterNick}
        value={inputRegister ? inputRegister : ""}
        onSubmit={registerNick}
      />
      <section className="bg-black flex justify-center items-center h-[40vh] w-full xl:h-[40vh] xl:w-full ">
        <h1 className="animalHunter titleColor font-bold tracking-wider text-7xl xl:text-7xl">
          LIVE CHAT
        </h1>
      </section>
    </div>
  );
}
