export const resolve_logout = async () => {
  try {
    const logout_enpoint = process.env.NEXT_PUBLIC_WS_LOGOUT;    
    const response = await fetch(`${logout_enpoint}`, {
      method: "POST",
      credentials: "include",
    });
    const data =  await response.json();    
    
  } catch (error) {
    console.log(error);
    throw new Error("error inesperado al cerrar sesion");
  }
};
