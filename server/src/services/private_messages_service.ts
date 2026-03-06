import { messageRepository } from "../config_database/data_source_migration";
import { Message } from "../config_database/entities/Message";
import { PrivateMessage } from "../types/messageToClient.t";

export const get_private_messages = async (
  sender_id: number,
  receiver_id: number,
  limit:number,
  offset:number
): Promise<PrivateMessage[]> => {
  if (Number.isNaN(sender_id) || Number.isNaN(receiver_id)) {
    throw new Error("error de autenticacion de usuarios");
  }
  const private_messages :PrivateMessage[] = await messageRepository
    .createQueryBuilder("message")
    .select(["message.id", "message.text", "message.craetedAt", "sender.id", "sender.name", "receiver.id", "receiver.name"])
    .leftJoin("message.sender", "sender")
    .leftJoin("message.receiver", "receiver")
    .where(
      "(sender.id = :sender_id AND receiver.id = :receiver_id) OR " +
        "(sender.id = :receiver_id AND receiver.id = :sender_id)",
      { sender_id, receiver_id }
    )
    .orderBy("message.craetedAt", "DESC")
    .skip(offset)
    .take(limit)
    .getMany();

  return private_messages;
};
