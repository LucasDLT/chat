import { messageRepository } from "../config_database/data_source.js";
import { Message } from "../config_database/entities/Message.js";

export const search_message_private = async (
  sender_id: number,
  receiver_id: number,
  search_data: string
): Promise<Message[]> => {
  const matches: Message[] = await messageRepository
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.sender", "sender")
    .leftJoinAndSelect("message.receiver", "receiver")
    .where(
      "(message.sender.id = :sender_id AND message.receiver.id = :receiver_id) OR " +
        "(message.receiver.id = :receiver_id AND message.sender.id = :sender_id)",
      { sender_id, receiver_id }
    )
    .andWhere("message.text ILIKE :search_data", {
      search_data: `%${search_data}%`,
    })
    .orderBy("message.craetedAt", "DESC")
    .getMany();


  const old_msg = matches[matches.length - 1];
  //aca va a dar un error si no hay ningun match y por ahora no tenemos mensajes cargados para probar

  const history_messages: Message[] = await messageRepository
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.sender", "sender")
    .leftJoinAndSelect("message.receiver", "receiver")
    .where(
      "(message.sender.id = :sender_id AND message.receiver.id = :receiver_id) OR " +
        "(message.receiver.id = :receiver_id AND message.sender.id = :sender_id)",
      { sender_id, receiver_id }
    )
    .andWhere("message.craetedAt >= :fromDate", {
      fromDate: old_msg?.craetedAt,
    })
    .orderBy("message.craetedAt", "DESC")
    .getMany();

  return history_messages;
};
