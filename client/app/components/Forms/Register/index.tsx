import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { FormsErrors, Register } from "@/types/types";
import { resolve_register } from "@/helpers/register";
import { useRouter } from "next/navigation";
import { Register_UI } from "@/app/ui/Register";
import { catch_errors_register } from "@/helpers/errors";
import { LoadingModal } from "../../LoadingModal";
export const FormRegister = () => {
  //estados
  const [inputRegister, setInputRegister] = useState<Register>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormsErrors>({
    email: "",
    name: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  //instancia router
  const router = useRouter();

  //onchange
  const onChangeRegisterNick = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const key = event.currentTarget.name;

    const update_form: Register = { ...inputRegister, [key]: value };

    setInputRegister(update_form);
    setErrors(catch_errors_register(update_form));
  };

  //submit
  const handleRegisterNick = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const validate_errors = catch_errors_register(inputRegister);
      const has_error = Object.keys(validate_errors).some((err) => err !== "");

      if (has_error) {
        return;
      }

      const { name, email, password } = inputRegister;
      const data_user = await resolve_register(name, email, password);
      
      if (!data_user) {
        throw new Error("error al recibir informacion de registro");
      }
      
      setInputRegister({ name: "", email: "", password: "" });
      //aca iria ese estado que cambia el valor booleano y hace que se vea el formulario de login.
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
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

      <Register_UI
        onChange={onChangeRegisterNick}
        onSubmit={handleRegisterNick}
        errors={errors}
        inputRegister={inputRegister}
      />
      {loading && <LoadingModal message="...procesando" />}
    </section>
  );
};
