"use client";
import { Login_Section } from "../Forms/Login";
import { Register_Section } from "../Forms/Register";
import { useState } from "react";
import { Aside_Message } from "@/app/ui/Aside_Form";
import { forms } from "@/types/types";

export const Container_Forms = () => {
  const [activeForm, setActiveForm] = useState<forms>(forms.register);

  return (
    <>
      <div className=" bg-[#d4ab4a78] flex justify-center items-center z-1">
        <p className="text-justify text-[14px]">
          Nota: el servidor se encuentra alojado en free tier de render.com, por
          lo que puede requerir unos segundos para activarse en el primer
          acceso.
        </p>
      </div>
      {activeForm === forms.register ? (
        <Register_Section setActiveForm={setActiveForm} />
      ) : (
        <Login_Section />
      )}

      <Aside_Message setter={setActiveForm} activeForm={activeForm} />
    </>
  );
};
