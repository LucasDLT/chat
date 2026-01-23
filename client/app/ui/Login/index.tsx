import { FormsErrors, Login } from "@/types/types";
import Image from "next/image";
export interface Login_UI_Props {
  onSubmit: (event: React.FormEvent) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FormsErrors;
  inputLogin: Login;
}
export const Login_UI: React.FC<Login_UI_Props> = ({
  errors,
  inputLogin,
  onChange,
  onSubmit,
}) => {
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
        onSubmit={onSubmit}
      >
        <label className="mesoninaRegular font-bold tracking-wider text-3xl">
          email
        </label>
        <input
          type="text"
          name="email"
          className="bgBlurYellow rounded"
          onChange={onChange}
          value={inputLogin.email}
        />
        <p className="text-red-700 mesoninaRegular font-bold tracking-widest">
          {errors.email}
        </p>
        <label className="mesoninaRegular font-bold tracking-wider text-3xl">
          password
        </label>
        <input
          type="password"
          name="password"
          className="bgBlurYellow rounded"
          onChange={onChange}
          value={inputLogin.password}
        />
        <p className="text-red-700 mesoninaRegular font-bold tracking-widest">
          {errors.password}
        </p>
        <button
          type="submit"
          className="border  borderYellow rounded p-1 m-1 mesoninaRegular tracking-widest font-extrabold text-[15px] hover:cursor-pointer borderYellow"
        >
          registrar
        </button>
      </form>
    </section>
  );
};
