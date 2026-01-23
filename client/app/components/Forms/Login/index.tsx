import Image from "next/image";
import { useAppContextWs } from "@/context/context";
import { ChangeEvent, FormEvent, useState } from "react";
import { Login, FormsErrors } from "@/types/types";
import { resolve_login } from "@/helpers/login";
import { useRouter } from "next/navigation";
import { catch_errors_login } from "@/helpers/errors";
import { LoadingModal } from "../../LoadingModal";
import { Login_UI } from "@/app/ui/Login";
export const FormLogin = () => {
  //contexto
  const { setActiveUser, setUser } = useAppContextWs();

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
      <Image
        height={300}
        width={500}
        alt="background register section"
        src={"/background-app.jpg"}
        className="h-full w-full object-cover xl:h-80 xl:rounded-sm xl:mt-10 xl:mb-10 "
      />

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


{/*
yo tengo un efecto que se activa desde ahora escuchando los eventos que sucedan sobre userAgent, un estado global. Esto quiere decir que siempre que este se cambie, se va a ejecutar el useEffect.
En ese mismo useeffect llevto toda la logica del Socket.
pero como no puedo iniciarlo hasta no tener una cookie alojada en httpOnly, tengo que hacerlo despues del login si o sign. 
Para esto lo que estoy tratanto de hacer es que ese estado user sea null o User, eso lo vamos a saber siempre que se haga login y user deje de ser null. 
Entonces la primer validacion antes de inciiar el socket es, si user es igual a null corto todo, pero necesito estar al tanto, por lo que en las dependencias del efecto tiene que ir user. 
Esto en /chat funciona al reves, alli si user es diferente a null es decir, tiene datos, se corta la ejecucion, no obstante si se refresca la pantalla y el contexto pierde datos, al tener un middleware que verifica si existen cookies me permite estar en ese path, por lo que al ser null user no me excluye pero si ejecuta un helper que llama a /me el estado user vuelve a completarse y todo vuelve a funcionar en segundos esto no se percibe practicamente.  
Ahora lo que intento es que el estado user tambien me sirva para dar paso al inicio del socket o esperar a que este disponible para poder hacerlo
*/}