import { messageRepository } from "../config_database/data_source.js";
import { PublicMessage } from "../types/messageToClient.t.js";
export const search_public_message_service = async (
  search_data: string,
): Promise<PublicMessage[]> => {
  const matches: PublicMessage[] = await messageRepository
    .createQueryBuilder("message")
    .select(["message.id", "message.text", "message.craetedAt", "sender.id", "sender.name"])
    .leftJoin("message.sender", "sender")
    .where("message.receiver is NULL")
    .andWhere("message.text ILIKE :search_data", {
      search_data: `%${search_data}%`,
    })
    .orderBy("message.craetedAt", "DESC")
    .getMany();

  if (matches.length === 0) return [];

  const old_message = matches[matches.length - 1];

  if (!old_message) {
    return [];
  }
  const from_date = old_message.craetedAt;

  const history_messages: PublicMessage[] = await messageRepository
    .createQueryBuilder("message")
    .select(["message.id", "message.text", "message.craetedAt", "sender.id", "sender.name"])
    .leftJoin("message.sender", "sender")
    .where("message.receiver is NULL")
    .andWhere("message.craetedAt >= :from_date", { from_date })
    .orderBy("message.craetedAt", "DESC")
    .getMany();

  return history_messages;
};
