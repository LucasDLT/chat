import { Message } from "../config_database/entities/Message.js";
import { messageRepository } from "../config_database/data_source.js";

export const search_public_message_service = async (
  search_data: string,
): Promise<Message[]> => {
  const matches: Message[] = await messageRepository
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.sender", "sender")
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

  const history_messages: Message[] = await messageRepository
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.sender", "sender")
    .where("message.receiver is NULL")
    .andWhere("message.craetedAt >= :from_date", { from_date })
    .orderBy("message.craetedAt", "DESC")
    .getMany();

    console.log(history_messages)
  return history_messages;
};
