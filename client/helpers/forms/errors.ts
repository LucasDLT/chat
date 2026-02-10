import { FormsErrors, Login, Register } from "@/types/types";

export const catch_errors_login = (form: Login): FormsErrors => {
  const bag_errors: FormsErrors = { email: "", password: "", name: "" };
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //hay que hacer una regex para passwords, pero eso va generar errores con las contraseñas ya generadas. asi que antes de limpiar la bdd y subirla hago la regex, la pruebo y subimos todo como corresponde, mientras dejamos esto asi para pruebas.

  if (!form.email.trim()) {
    bag_errors.email = "campo requerido para continuar";
  } else if (!email_regex.test(form.email.trim())) {
    bag_errors.email = "formato invalido";
  }

  if (!form.password.trim()) {
    bag_errors.password = "campo requerido para continuar";
  }
  if (form.password && form.password.length < 8) {
    bag_errors.password = "debe contener minimo 8 caracteres";
  }

  return bag_errors;
};
export const catch_errors_register = (form: Register): FormsErrors => {
  const bag_errors: FormsErrors = { email: "", password: "", name: "" };
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //hay que hacer una regex para passwords, pero eso va generar errores con las contraseñas ya generadas. asi que antes de limpiar la bdd y subirla hago la regex, la pruebo y subimos todo como corresponde, mientras dejamos esto asi para pruebas.

  if (!form.email.trim()) {
    bag_errors.email = "campo requerido para continuar";
  } else if (!email_regex.test(form.email.trim())) {
    bag_errors.email = "formato invalido";
  }

  if (!form.password.trim()) {
    bag_errors.password = "campo requerido para continuar";
  }
  if (form.password && form.password.length < 8) {
    bag_errors.password = "debe contener minimo 8 caracteres";
  }

  if (!form.name.trim()) {
    bag_errors.name = "campo obligatorio para registrarse";
  }
  if (form.name.trim().length < 10) {
    bag_errors.name = "no puede superar 10 caracteres";
  }

  return bag_errors;
};