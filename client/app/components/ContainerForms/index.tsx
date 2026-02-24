"use client";
import { useRouter } from "next/navigation";
import { Login_Section } from "../Forms/Login";
import { Register_Section } from "../Forms/Register";
import { useState } from "react";
import { Aside_Message } from "@/app/ui/Aside_Form";
import { forms } from "@/types/types";

export const Container_Forms = () => {
  const [activeForm, setActiveForm] = useState<forms>(forms.register);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => {
          router.push("/");
        }}
      >
        ir atras
      </button>
      {activeForm === forms.register ? <Register_Section /> : <Login_Section />}

      <Aside_Message setter={setActiveForm} activeForm={activeForm} />
    </>
  );
};
