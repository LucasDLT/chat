import { forms } from "@/types/types";
import Image from "next/image";
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
    <aside className="bg-[#d4ab4a78] flex flex-col justify-center items-center w-full h-full z-1 gap-5">
      <a
        className="flex justify-center items-center gap-2 border border-black p-2 rounded bg-[#1a1509ca]"
        href={google_endpoint}
      >
        Continuar con Google
        <Image src="/icons/google.png" alt="google" width={20} height={20} />
      </a>
      {activeForm === forms.register ? (
        <div className="flex justify-between items-center w-60">
          <p>¿estas registrado?</p>
          <button
            className="underline hover:cursor-pointer text-black hover:no-underline"
            onClick={() => setter(forms.login)}
          >
            ingresar
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center w-60 border border-black">
          <p>¿aun no estas registrado?</p>
          <button onClick={() => setter(forms.register)}>Crear cuenta</button>
        </div>
      )}
    </aside>
  );
};
