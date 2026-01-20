'use client'
import { FormRegister } from "@/app/components/Forms/Register";
import { FormLogin } from "@/app/components/Forms/Login";

export default function Home() {

  return (
    <div className="flex flex-col justify-between items-center yellowBg h-screen">
      <FormLogin/>
      <section className="bg-black flex justify-center items-center h-[40vh] w-full xl:h-[40vh] xl:w-full ">
        <h1 className="mesoninaRegular titleColor font-bold tracking-wider text-7xl xl:text-7xl">
          LIVE CHAT
        </h1>
      </section>
    </div>
  );
}
