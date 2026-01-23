
export const resolve_register = async (
  name: string,
  email: string,
  password: string
): Promise<string> => {
    const register_enpoint = process.env.NEXT_PUBLIC_WS_REGISTER;
    const response = await fetch(`${register_enpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      //credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });

    const {message} = await response.json();

    if (!message) {
      throw new Error("error al registrar usuario");
    }

    console.log(message);
    return message;
      
};
