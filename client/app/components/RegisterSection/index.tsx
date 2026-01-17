import Image from "next/image";
import { useAppContextWs } from "@/context/context";
import { ChangeEvent, FormEvent, useState } from "react";
import { Register } from "@/types/types";
import { resolve_register } from "@/helpers/register";
import { useRouter } from "next/navigation";
export const RegisterNickSection = () => {
  //contexto
  const { handleActiveRegister, activeRegister } = useAppContextWs();

  //estados
  const [inputRegister, setInputRegister] = useState<Register>({
    name: "",
    email: "",
    password: "",
  });

  //instancia router
  const router = useRouter();

  //onchange
  const changeRegisterNick = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const key = event.currentTarget.name;

    setInputRegister((prev) => ({ ...prev, [key]: value }));
    //eventualmente voy a tener que poner el control de errores aca. Por ahora no lo hago
  };

  //submit
  const registerNick = async (event: FormEvent) => {
    event.preventDefault();
    const { name, email, password } = inputRegister;
    const data_user = await resolve_register(name, email, password);
    if (!data_user) {
      throw new Error("error al recibir informacion del resolve login");
    }
    setInputRegister({ name: "", email: "", password: "" });
    router.push("/chat");
  };
  return (
    <section className="flex flex-col justify-center items-center relative h-[60vh]">
      <Image
        height={300}
        width={500}
        alt="background register section"
        src={"/background-app.jpg"}
        className="h-full w-full object-cover xl:h-80 xl:rounded-sm xl:mt-10 xl:mb-10 "
      />

      {activeRegister ? (
        <form
          className="flex flex-col g-1 justify-center items-center backdrop-blur-[2px] absolute h-50 w-60 rounded-sm border borderYellow gap-4"
          onSubmit={registerNick}
        >
          <button
            type="button"
            onClick={handleActiveRegister}
            className="flex justify-end items-end absolute right-1 top-1 px-2 bgBlurYellow rounded text-gray-200 border borderYellow hover:cursor-pointer"
          >
            x
          </button>
          <label className="mesoninaRegular font-bold tracking-wider text-3xl">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            className="bgBlurYellow rounded"
            onChange={changeRegisterNick}
            value={inputRegister.name}
          />
          <label className="mesoninaRegular font-bold tracking-wider text-3xl">
            email
          </label>
          <input
            type="text"
            name="email"
            className="bgBlurYellow rounded"
            onChange={changeRegisterNick}
            value={inputRegister.email}
          />
          <label className="mesoninaRegular font-bold tracking-wider text-3xl">
            password
          </label>
          <input
            type="password"
            name="password"
            className="bgBlurYellow rounded"
            onChange={changeRegisterNick}
            value={inputRegister.password}
          />

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
      ) : (
        <button
          onClick={handleActiveRegister}
          className=" text-center w-28 rounded p-2 m-1 absolute text-black bg-yellow-200/60 backdrop-blur-[1px] hover:cursor-pointer mesoninaRegular font-extrabold tracking-[5px]"
        >
          INGRESAR
        </button>
      )}
    </section>
  );
};
