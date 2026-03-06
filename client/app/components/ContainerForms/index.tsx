"use client";
import { Login_Section } from "../Forms/Login";
import { Register_Section } from "../Forms/Register";
import { useEffect, useState } from "react";
import { Aside_Message } from "@/app/ui/Aside_Form";
import { forms } from "@/types/types";
import { useRouter } from "next/navigation";
import { resolve_request_me } from "@/helpers/me";

export const Container_Forms = () => {
  const [activeForm, setActiveForm] = useState<forms>(forms.register);
  const router = useRouter();
  //verificacion para UX, si el usuario esta logueado lo redirecciona a /chat
  //no le permito estar logueado y acceder a register o login
  //el useeffect ejecuta resolve_request_me, esto devuelve un usuario, si es null lo dejo entrar a /forms pero si devuelve algo diferente a null lo redirecciona a /chat
  useEffect(() => {
    const veryfy_user = async () => {
      const refresh_user = await resolve_request_me();
      if (refresh_user !== null) {
        router.push("/chat");
      }
    };
    veryfy_user();
  }, []);
  return (
    <>
      <div className=" bg-[#d4ab4a78] flex justify-center items-center z-1"></div>
      {activeForm === forms.register ? (
        <Register_Section setActiveForm={setActiveForm} />
      ) : (
        <Login_Section />
      )}

      <Aside_Message setter={setActiveForm} activeForm={activeForm} />
    </>
  );
};
