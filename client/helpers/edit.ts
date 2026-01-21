import { User } from "@/types/types";

export const resolve_edit = async (new_name: string): Promise<User> => {
  try {
    console.log("esto llega al helper", new_name);

    const edit_enpoint = process.env.NEXT_PUBLIC_WS_EDIT;
    const response = await fetch(`${edit_enpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      credentials: "include",
      body: JSON.stringify({ new_name }),
    });

    const { new_user } = await response.json();
    console.log(new_user);

    if (!new_user) {
      throw new Error("error user no llego al edit");
    }
    const new_data: User = {
      id: new_user.id,
      name: new_user.name,
      email: new_user.email,
      provider: new_user.provider,
    };

    console.log(new_data);
    return new_data;
  } catch (error) {
    console.log(error);
    throw new Error(`${error}`);
  }
};
