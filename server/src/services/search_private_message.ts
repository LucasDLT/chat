import { messageRepository } from "../config_database/data_source.js";
import { Brackets } from "typeorm";
import { PrivateMessage } from "../types/messageToClient.t.js";
export const search_message_private = async (
  sender_id: number,
  receiver_id: number,
  search_data: string,
): Promise< PrivateMessage[] > => {
  const matches:  PrivateMessage[]  = await messageRepository
    .createQueryBuilder("message")
    .select(["message.id", "message.text", "message.craetedAt", "sender.id", "sender.name", "receiver.id", "receiver.name"])
    .leftJoin("message.sender", "sender")
    .leftJoin("message.receiver", "receiver")
    .where(
      "((sender.id = :sender_id AND receiver.id = :receiver_id) OR " +
        "(sender.id = :receiver_id AND receiver.id = :sender_id))",
      { sender_id, receiver_id },
    )
    .andWhere("message.text ILIKE :search_data", {
      search_data: `%${search_data}%`,
    })
    .orderBy("message.craetedAt", "DESC")
    .getMany();

    if(matches.length === 0)return []
  const old_msg = matches[matches.length - 1];
  if (!old_msg) {
    return[]
  }
  const from_date = old_msg.craetedAt 

  //aca va a dar un error si no hay ningun match y por ahora no tenemos mensajes cargados para probar

  const history_messages: PrivateMessage[] = await messageRepository
    .createQueryBuilder("message")
    .select(["message.id", "message.text", "message.craetedAt", "sender.id", "sender.name", "receiver.id", "receiver.name"])
    .leftJoin("message.sender", "sender")
    .leftJoin("message.receiver", "receiver")
    .where(
      new Brackets((qb) => {
        qb.where(
          "sender.id = :sender_id AND receiver.id = :receiver_id",
        ).orWhere(
          "sender.id = :receiver_id AND receiver.id = :sender_id");
      }),
       { sender_id, receiver_id },
    )
    .andWhere("message.craetedAt >= :from_date", {
      from_date,
    })
    .orderBy("message.craetedAt", "DESC")
    .getMany();

  return history_messages;
};
