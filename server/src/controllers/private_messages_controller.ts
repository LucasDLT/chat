import { Request, Response } from "express";
import { get_private_messages } from "../services/private_messages_service.js";
export const private_messages_controller = async (
  req: Request,
  res: Response
) => {
  try {
    const sender_id = req.id;
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    if (Number.isNaN(limit) || Number.isNaN(offset)) {
      return res.status(400).json({
        message: "limit y offset deben ser números válidos",
      });
    }
    if (!sender_id) {
      throw new Error("Error de autenticacion");
    }
    const receiver_id = Number(req.params.id);
    if (!receiver_id) {
      throw new Error("Error de identificacion de cliente");
    }

    const private_messages = await get_private_messages(sender_id, receiver_id, limit, offset);
    res.status(200).json({
      message: "consulta exitosa",
      private_messages,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
