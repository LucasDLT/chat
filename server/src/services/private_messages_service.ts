import { messageRepository } from "../config_database/data_source.js";
import { Message } from "../config_database/entities/Message.js";

export const get_private_messages = async (
  sender_id: number,
  receiver_id: number,
  limit:number,
  offset:number
): Promise<Message[]> => {
  if (Number.isNaN(sender_id) || Number.isNaN(receiver_id)) {
    throw new Error("error de autenticacion de usuarios");
  }
  const private_messages: Message[] = await messageRepository
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.sender", "sender")
    .leftJoinAndSelect("message.receiver", "receiver")
    .where(
      "(message.sender.id = :sender_id AND message.receiver.id = :receiver_id) OR " +
        "(message.receiver.id = :receiver_id AND message.sender.id = :sender_id)",
      { sender_id, receiver_id }
    )
    .orderBy("message.craetedAt", "ASC")
    .skip(offset)
    .take(limit)
    .getMany();

  return private_messages;
};
