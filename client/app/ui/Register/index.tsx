import { FormsErrors, Register } from "@/types/types";
import React from "react";

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
      className="flex flex-col g-1 justify-center items-center backdrop-blur-[2px] absolute h-50 w-60 rounded-sm border borderYellow gap-4"
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
      <p>{errors.name}</p>
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
      <p>{errors.email}</p>
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
      <p>{errors.password}</p>

      <button
        type="submit"
        className="border  borderYellow rounded p-1 m-1 mesoninaRegular tracking-widest font-extrabold text-[15px] hover:cursor-pointer borderYellow"
      >
        registrar
      </button>
      <p className="titleColor mesoninaRegular font-bold tracking-widest">
        Ya casi terminas
      </p>
    </form>
  );
};
