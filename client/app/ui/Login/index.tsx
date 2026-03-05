import { FormsErrors, Login } from "@/types/types";
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
    <form
      className="flex flex-col p-2 justify-center items-center backdrop-blur-[2px] bg-black/50 h-80  w-70 rounded-sm border borderYellow gap-4"
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
      <p className="text-red-600 mesoninaRegular tracking-widest h-0 text-sm font-extrabold">
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
      <p className="text-red-600 mesoninaRegular tracking-widest h-0 text-sm font-extrabold">
        {errors.password}
      </p>
      <button
        type="submit"
        className="border bgBlurYellow rounded p-1 m-1 mesoninaRegular tracking-widest font-extrabold text-[15px] hover:cursor-pointer borderYellow text-black text-bolder"
      >
        ingresar
      </button>
    </form>
  );
};
