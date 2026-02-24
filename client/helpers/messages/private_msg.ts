import { PrivateMessage } from "@/types/types";

const endpoint_private_message = process.env.NEXT_PUBLIC_WS_MESSAGES_PRIVATE;
export const resolve_private_messages = async (id: number, offset:number, limit:number ):Promise<PrivateMessage[]> => {

  const limitString = limit.toString();
  const offsetString = offset.toString();
  
  
  const querys = new URLSearchParams({
      offset: offsetString,
      limit: limitString,
    })

  const response = await fetch(`${endpoint_private_message}/${id}/?${querys.toString()}`,{
    method:"GET",
    credentials:"include"
  })    
  const res = await response.json()

  const private_messages:PrivateMessage[] = res.private_messages

  return private_messages  
};
