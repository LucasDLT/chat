import { forms } from "@/types/types";

export interface Aside_Message_Props {
  setter: React.Dispatch<React.SetStateAction<forms>>;
  activeForm: forms;
}
export const Aside_Message: React.FC<Aside_Message_Props> = ({
  activeForm,
  setter,
}) => {
  const google_endpoint = process.env.NEXT_PUBLIC_WS_INITCALLBACK;

  return (
    <aside>
      <a href={google_endpoint}>iniciar con Google?</a>
        {activeForm === forms.register ? (
          <div>
            <p>¿estas registrado?</p>
            <button onClick={() => setter(forms.login)}>ingresar</button>
          </div>
        ) : (
          <div>
            <p>¿aun no estas registrado?</p>
            <button onClick={() => setter(forms.register)}>
              crear cuenta
            </button>
          </div>
        )}
    </aside>
  );
};
