import { PublicMessage } from "@/types/types";
export const resolve_public_messages = async (
  offsetPublic: number,
  limitPublic: number,
): Promise<PublicMessage[]> => {
  const endpoint_public_message = process.env.NEXT_PUBLIC_WS_MESSAGES_PUBLIC;

  const limitString = limitPublic.toString();
  const offsetString = offsetPublic.toString();

  const querys = new URLSearchParams({
    offset: offsetString,
    limit: limitString,
  });

  const response = await fetch(
    `${endpoint_public_message}/?${querys.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  const res_public_messages = await response.json();
  
  const public_messages: PublicMessage[] = res_public_messages.messages_publics;
  return public_messages;
};
