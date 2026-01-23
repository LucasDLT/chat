import { useAppContextWs } from "@/context/context";
import { resolve_edit } from "@/helpers/edit";
import { ChangeEvent, FormEvent, useState } from "react";

export const EditForm = () => {
  const { user, setUser } = useAppContextWs();
  const [value, setValue] = useState<string>("")

  const onChangeNick = async (event: ChangeEvent<HTMLInputElement>) => {
    const data = event.currentTarget.value;
    setValue(data);
    console.log();
    
  };

  const onSubmitChangeNick = async (event: FormEvent) => {
    event.preventDefault();
    const data = await resolve_edit(value);
    if (!data) {
      throw new Error("error al recibir informacion del resolve login");
    }
    setUser(data);
  };

  return (
    <form
      className="flex flex-col g-1 justify-center items-center h-40 w-50 rounded-sm mt-4"
      onSubmit={onSubmitChangeNick}
    >
      <label className="mesoninaRegular text-black font-bold tracking-wider text-xl">
        {user?.name}
      </label>
      <input
        type="text"
        className="blackDegbg rounded text-black px-px m-1 text-center"
        onChange={onChangeNick}
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
