export const resolve_private_messages = async (id: number, offset:number, limit:number ) => {
  const endpoint_private_message = process.env.NEXT_PUBLIC_WS_MESSAGES_PRIVATE;

  const limitString = limit.toString();
  const offsetString = offset.toString();
  
  
  const querys = new URLSearchParams({
      offset: offsetString,
      limit: limitString,
    })
    console.log(id, endpoint_private_message, querys.toString(), "id que llega al helper");

  const response = await fetch(`${endpoint_private_message}/${id}/?${querys.toString()}`,{
    method:"GET",
    credentials:"include"
  })    
  const private_messages = await response.json()
  console.log(private_messages, "resultado de helper");
  
};
