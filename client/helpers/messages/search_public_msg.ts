import { PublicMessage } from "@/types/types";

export const resolve_search_public_messages = async (
  text: string,
): Promise<PublicMessage[]> => {
  const endpoint_search_public_message =
    process.env.NEXT_PUBLIC_WS_SEARCH_MESSAGES_PUBLIC;

  const response = await fetch(`${endpoint_search_public_message}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({ text }),
  });
  const res_public_messages = await response.json();
  const public_messages: PublicMessage[] = res_public_messages.history_messages;
  return public_messages;
};
