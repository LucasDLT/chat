import Image from "next/image";
import { useAppContextWs } from "@/context/context";
import { ChangeEvent, FormEvent, useState } from "react";
import { Login, FormsErrors } from "@/types/types";
import { resolve_login } from "@/helpers/login";
import { useRouter } from "next/navigation";
import { catch_errors_login } from "@/helpers/errors";
import { LoadingModal } from "../../LoadingModal";
import { Login_UI } from "@/app/ui/Login";
export const Login_Section = () => {
  //contexto
  const {  setUser } = useAppContextWs();

  //estados
  const [inputLogin, setInputLogin] = useState<Login>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormsErrors>({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  //instancia router
  const router = useRouter();
  
  //onchange
  const onChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
    //en las contantes value y key extraigo los valores del input y el name. Para eso tengo que colocarles la propiedad name en cada input.
    const value = event.currentTarget.value;
    const key = event.currentTarget.name;

    //objeto para guardar dinamicamente los valores capturados con currentTarget
    const update_form = { ...inputLogin, [key]: value };
    //seteo de informacion en el estado
    setInputLogin(update_form);
    //seteo y validacion en tiempo real de errores pasando los valores anteriores
    setErrors(catch_errors_login(update_form));
  };

  //submit
  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);
    try {
      const validate_errors = catch_errors_login(inputLogin);
      setErrors(validate_errors);

      const has_error = Object.values(validate_errors).some(
        (err) => err !== "",
      );

      if (has_error) {
        return;
      }
      const { email, password } = inputLogin;
      const data_user = await resolve_login(email, password);

      if (!data_user) {
        throw new Error("error al recibir informacion del resolve login");
      }

      setUser(data_user);
      setInputLogin({ email: "", password: "" });
      router.push("/chat");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <section className="flex flex-col justify-center items-center relative h-[60vh]">

      <Login_UI
        onSubmit={handleLogin}
        onChange={onChangeLogin}
        errors={errors}
        inputLogin={inputLogin}
      />

      {loading && <LoadingModal message="...procesando" />}
    </section>
  );
};
