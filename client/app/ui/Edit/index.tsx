import { User } from "@/types/types";

export interface Edit_UI_Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  value: string;
  user: User;
}

export const Form_Edit_UI: React.FC<Edit_UI_Props> = ({
  onChange,
  onSubmit,
  value,
  user,
}) => {
  return (
    <form
      className="flex flex-col g-1 justify-center items-center h-40 w-50 rounded-sm mt-4"
      onSubmit={onSubmit}
    >
      <label className="mesoninaRegular text-black font-bold tracking-wider text-xl">
        {user?.name}
      </label>
      <input
        type="text"
        className="blackDegbg rounded text-black px-px m-1 text-center"
        onChange={onChange}
        name="name"
        value={value}
      />
      <button
        type="submit"
        className="text-black bg-gray-500/50 rounded px-1 m-1 mesoninaRegular tracking-widest font-extrabold text-[15px] hover:cursor-pointer borderYellow"
      >
        guardar y cambiar
      </button>
    </form>
  );
};
