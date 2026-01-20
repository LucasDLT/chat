export const resolve_request_me = async () => {
  try {
    const me_endpoint = process.env.NEXT_PUBLIC_WS_ME;
    const response = await fetch(`${me_endpoint}`, {
      method: "GET",
      credentials: "include",
    });
    const res_data = await response.json();
    console.log(res_data);
  } catch (error) {
    console.log(error);
  }
};
//esta funcion es solo para los ingresos con google que necesitan doble verificacion desde el servidor y envian la cookie