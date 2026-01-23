export const resolve_request_me = async () => {
  
    const me_endpoint = process.env.NEXT_PUBLIC_WS_ME;
    const response = await fetch(`${me_endpoint}`, {
      method: "GET",
      credentials: "include",
    });
    const {user} = await response.json();
    console.log(user, "HELPER");
    if (!user) {
      throw new Error("error en la verificacion de usuario");
    }
    
    return user
};
//esta funcion es solo para los ingresos con google que necesitan doble verificacion desde el servidor y envian la cookie