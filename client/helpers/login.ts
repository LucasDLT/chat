import { User } from "@/types/types";

export const resolve_login = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const login_enpoint = process.env.NEXT_PUBLIC_WS_LOGIN;
    const response = await fetch(`${login_enpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data: User = await response.json();

    if (!data) {
      throw new Error("error en respuesta del login");
    }

    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("error en respuesta del login");
  }
};
