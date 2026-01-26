export const resolve_public_messages = async ( offsetPublic:number, limitPublic:number ) => {
  const endpoint_public_message = process.env.NEXT_PUBLIC_WS_MESSAGES_PUBLIC;

  const limitString = limitPublic.toString();
  const offsetString = offsetPublic.toString();
  
  
  const querys = new URLSearchParams({
      offset: offsetString,
      limit: limitString,
    })
    console.log( endpoint_public_message, querys.toString(), "id que llega al helper");

  const response = await fetch(`${endpoint_public_message}/?${querys.toString()}`,{
    method:"GET",
    credentials:"include"
  })    
  const public_messages = await response.json()
  console.log(public_messages, "resultado de helper");
  //nota importante, deberia sacar desde aca, tipado el retorno para recibirlo limpio en el contexto
};
