import { messageRepository } from "../config_database/data_source.js";
import { Message } from "../config_database/entities/Message.js";

export const get_all_public_msg = async (
  limit: number,
  offset: number
): Promise<Message[]> => {
  const messages_publics: Message[] = await messageRepository
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.sender", "sender")
    .where("message.receiver is NULL")
    .orderBy("message.craetedAt", "DESC")
    .skip(offset)
    .take(limit)
    .getMany();

  console.log("resultado", messages_publics);

  return messages_publics;
};
