import { Request, Response } from "express";
import { search_public_message_service } from "../services/search_public_message.js";

export const search_public_messages_controller = async (
  req: Request,
  res: Response,
) => {
  try {
    const user_id = req.id;
    if (!user_id) {
      throw new Error("Error de autenticacion");
    }
    const search_data: string = req.body.text;

    if (typeof search_data !== "string") {
      throw new Error("El parametro a buscar posee un formato invalido");
    }
    const history_messages = await search_public_message_service(search_data);

    res.status(200).json({
      message: "Resultados compatibles con la busqueda",
      history_messages,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
