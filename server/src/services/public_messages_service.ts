import { messageRepository } from "../config_database/data_source.js";
import { PublicMessage } from "../types/messageToClient.t.js";



export const get_all_public_msg = async (
  limit: number,
  offset: number,
): Promise<PublicMessage[]> => {
  const messages_publics = await messageRepository
    .createQueryBuilder("message")
    .select([
      "message.id",
      "message.text",
      "message.craetedAt",
      "sender.id",
      "sender.name",
    ])
    .leftJoin("message.sender", "sender")
    .where("message.receiver is NULL")
    .orderBy("message.craetedAt", "DESC")
    .skip(offset)
    .take(limit)
    .getMany();

  return messages_publics;
};
{
  /*nota, en esta funcion aprendi que estaba retornando los passwords de los usuarios y los google_id, para evitar este comportamiento cree dos interfaces, una del mensaje en si pero si, simulando la relacion con otra interface de usuarios publicos, a la que solo le deje id y name, luego use esta dentro de la primera y con esto tenia tipado el retorno. 
  Lo mas importante fue el uso de "select", con él seleccionas las propiedades que queres traer, pero no seleccionas entidades, sino que seleccionas "alias", por eso usa message que lo indicamos como alias en el querybuilder y sender que lo indicamos en el leftjoin.
  el descubrimiento fue que al usar select, debia dejar de usar leftjoinandselect y utilizar leftjoin solo*/
}
