import { Request, Response } from "express";
import { search_message_private } from "../services/search_private_message.js";

export const search_priv_message = async (req: Request, res: Response) => {
  try {
    const sender_id = req.id;
    if (!sender_id) {
      throw new Error("Error de autenticacion");
    }
    const receiver_id = Number(req.params.id);
    const offset = Number(req.query.offset);
    const limit = Number(req.query.limit);

    if (
      Number.isNaN(receiver_id) ||
      Number.isNaN(offset) ||
      Number.isNaN(limit)
    ) {
      throw new Error("Error en la vaidacion de datos de busqueda");
    }

    const search_data: string = req.body.text;

    if (typeof search_data !== "string") {
      throw new Error("El parametro a buscar posee un formato invalido");
    }

    const matches = await search_message_private(
      sender_id,
      receiver_id,
      offset,
      limit,
      search_data
    );

    res.status(200).json({
      message: "resultados compatibles con la busqueda",
      matches,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
