import Image from "next/image";
import { useAppContextWs } from "@/context/context";
import { ChangeEvent, FormEvent, useState } from "react";
import { Login } from "@/types/types";
import { resolve_login } from "@/helpers/login";
import { useRouter } from "next/navigation";
import { resolve_logout } from "@/helpers/logout";
export const FormLogin = () => {
  //contexto
  const { handleActiveUser, activeUser } = useAppContextWs();

  //estados
  const [inputLogin, setInputLogin] = useState<Login>({
    email: "",
    password: "",
  });

  //instancia router
  const router = useRouter();

  //onchange
  const onChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const key = event.currentTarget.name;

    setInputLogin((prev) => ({ ...prev, [key]: value }));
    //eventualmente voy a tener que poner el control de errores aca. Por ahora no lo hago
  };

  //submit
  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const { email, password } = inputLogin;
    const data_user = await resolve_login(email, password);
    if (!data_user) {
      throw new Error("error al recibir informacion del resolve login");
    }
    handleActiveUser()
    setInputLogin({ email: "", password: "" });

    //router.push("/chat");
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

      <form
        className="flex flex-col g-1 justify-center items-center backdrop-blur-[2px] absolute h-50 w-60 rounded-sm border borderYellow gap-4"
        onSubmit={handleLogin}
      >
        <label className="mesoninaRegular font-bold tracking-wider text-3xl">
          email
        </label>
        <input
          type="text"
          name="email"
          className="bgBlurYellow rounded"
          onChange={onChangeLogin}
          value={inputLogin.email}
        />
        <label className="mesoninaRegular font-bold tracking-wider text-3xl">
          password
        </label>
        <input
          type="password"
          name="password"
          className="bgBlurYellow rounded"
          onChange={onChangeLogin}
          value={inputLogin.password}
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

      <a href="http://localhost:3001/auth/google">iniciar con Google?</a>
      <p>¿aun no estas registrado?</p>
      <div>
        <button onClick={() => router.push("/login")}>¿crear cuenta?</button>
      </div>
            <button
              className="z-100 relative right-90 hover:cursor-pointer"
              onClick={() => {
                resolve_logout();
              }}
            >
              cerrar sesion
            </button>
    </section>
  );
};
