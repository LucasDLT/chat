import { PrivateMessage } from "@/types/types";

export const resolve_search_private_messages = async (
  text: string,
  id: number,
): Promise<PrivateMessage[]> => {
  const endpoint_search_private_message =
    process.env.NEXT_PUBLIC_WS_SEARCH_MESSAGES_PRIVATE;

  console.log(text, "lo llega al helper para buscar");

  const response = await fetch(`${endpoint_search_private_message}/${id}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({ text }),
  });
  const res = await response.json();
  const private_messages: PrivateMessage[] = res.private_messages;
  return private_messages;
};
