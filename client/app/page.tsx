'use client'
import { RegisterNickSection } from "@/components/RegisterSection";
import { useAppContextWs } from "@/context/context";


export default function Home() {
  const {
    hasNickname,
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
        hasNickname={hasNickname}
      />


      {/*formulario para envio de mensajes*/}
      {/* 
      <form
        onSubmit={privateIdMsg ? sendMessagePrivate : sendMessage}
        className="flex items-center bg-amber-50 rounded mt-1"
      >
        <input
          onChange={changeInputMessage}
          value={inputMsg}
          type="text"
          className="border m-1 rounded bg-neutral-800 text-white p-1"
        />
        <button className="border m-1 rounded bg-neutral-800 text-white text-sm p-1.5 hover:cursor-pointer">
          enviar
        </button>
      </form>
      */}
      <section className="bg-black flex justify-center items-center h-[40vh] w-full xl:h-[40vh] xl:w-full ">
        <h1 className="animalHunter titleColor font-bold tracking-wider text-7xl xl:text-7xl">
          LIVE CHAT
        </h1>
      </section>
    </div>
  );
}
