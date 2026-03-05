import { User } from "@/types/types";

export const resolve_login = async (
  email: string,
  password: string,
): Promise<User> => {
  const login_enpoint = process.env.NEXT_PUBLIC_WS_LOGIN; 
  const response = await fetch(`${login_enpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const { user } = await response.json();

  if (!user) {
    throw new Error("error en respuesta del login");
  }
  const new_data: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
  };

  return new_data;
};
