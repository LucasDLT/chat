import { FormsErrors, Register } from "@/types/types";
import React from "react";
import Image from "next/image";

interface Register_Form_UI {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRegister: Register;
  errors: FormsErrors;
}

export const Register_UI: React.FC<Register_Form_UI> = ({
  onChange,
  onSubmit,
  errors,
  inputRegister,
}) => {
  return (
    <form
      className="flex flex-col p-2 justify-center items-center backdrop-blur-[2px] w-70 rounded-sm border borderYellow gap-4 bg-black/50"
      onSubmit={onSubmit}
    >
      <label className="mesoninaRegular font-bold tracking-wider text-3xl">
        Nombre
      </label>
      <input
        type="text"
        name="name"
        className="bgBlurYellow rounded"
        onChange={onChange}
        value={inputRegister.name}
      />
      <p className="text-red-600 mesoninaRegular tracking-widest h-0 text-sm font-extrabold">{errors.name}</p>
      <label className="mesoninaRegular font-bold tracking-wider text-3xl">
        email
      </label>
      <input
        type="text"
        name="email"
        className="bgBlurYellow rounded"
        onChange={onChange}
        value={inputRegister.email}
      />
      <p className="text-red-600 mesoninaRegular tracking-widest h-0 text-sm font-extrabold">{errors.email}</p>
      <label className="mesoninaRegular font-bold tracking-wider text-3xl">
        password
      </label>
      <input
        type="password"
        name="password"
        className="bgBlurYellow rounded"
        onChange={onChange}
        value={inputRegister.password}
      />
       <p className="text-red-600 mesoninaRegular tracking-widest h-0 text-sm font-extrabold">{errors.password}</p>

      <button
        type="submit"
        className="border bgBlurYellow rounded p-1 m-1 mesoninaRegular tracking-widest font-extrabold text-[15px] hover:cursor-pointer borderYellow text-black text-bolder"
      >
        registrar
      </button>
    </form>
  );
};
