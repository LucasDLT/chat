import { get_all_public_msg } from "../services/public_messages_service.js";
import { Request, Response } from "express";

export const get_public_messages_controller = async (
  req: Request,
  res: Response
) => {
  try {
      const user_id = req.id;
    const limit = Number(req.query.limit);
const offset = Number(req.query.offset);

console.log({ limit, offset });

if (Number.isNaN(limit) || Number.isNaN(offset)) {
  return res.status(400).json({
    message: "limit y offset deben ser números válidos",
  });
}

    if (!user_id) {
      throw new Error("Error de autenticacion");
    }

    const messages_publics = await get_all_public_msg(limit, offset);
    console.log(messages_publics);

    res.status(200).json({
      message: "mensajes publicos",
      messages_publics,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
