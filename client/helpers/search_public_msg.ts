export const resolve_search_public_messages = async ( text: string ) => {
  const endpoint_search_public_message = process.env.NEXT_PUBLIC_WS_SEARCH_MESSAGES_PUBLIC;

    console.log( text, "lo llega al helper");

  const response = await fetch(`${endpoint_search_public_message}`,{
    method:"POST",
    credentials:"include",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({ text }),
  })    
  const res_search = await response.json()
  console.log(res_search, "resultado de helper");
  //nota importante, deberia sacar desde aca, tipado el retorno para recibirlo limpio en el contexto
};