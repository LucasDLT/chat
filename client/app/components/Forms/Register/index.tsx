import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { FormsErrors, Register } from "@/types/types";
import { resolve_register } from "@/helpers/forms/register";
import { Register_UI } from "@/app/ui/Register";
import { catch_errors_register } from "@/helpers/forms/errors";
import { LoadingModal } from "../../LoadingModal";
export const Register_Section = () => {
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
      setErrors(validate_errors);
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
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="flex flex-col justify-center items-center">
      <Image
        fill
        alt="background register section"
        src={"/background-app.jpg"}
        className="h-full w-auto object-cover  "
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
