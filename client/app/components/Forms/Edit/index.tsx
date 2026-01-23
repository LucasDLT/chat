import { Form_Edit_UI } from "@/app/ui/Edit";
import { useAppContextWs } from "@/context/context";
import { resolve_edit } from "@/helpers/edit";
import { ChangeEvent, FormEvent, useState } from "react";
export const Section_Edit_Form = () => {
  const { user, setUser } = useAppContextWs();
  const [value, setValue] = useState<string>("")
  const current_name = user?.name

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
    setValue("");
  };
  return (
<Form_Edit_UI
onChange={onChangeNick}
onSubmit={onSubmitChangeNick}
value={value}
current_name={current_name}
 />
  );
};
