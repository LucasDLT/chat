'use client'
import { FormRegister } from "@/app/components/Forms/Register";
import { FormLogin } from "@/app/components/Forms/Login";
import { useRouter } from "next/navigation";
import { Aside_Message } from "../ui/Aside_Form";



export default function Forms() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between items-center yellowBg h-screen">
      <FormLogin/>
      <Aside_Message 
      router={router}/>

    </div>
  );
}
//queda por hacer el estado global booleano que cambia los mensajes del aside y tambien los formularios