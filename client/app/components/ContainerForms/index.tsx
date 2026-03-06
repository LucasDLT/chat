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
