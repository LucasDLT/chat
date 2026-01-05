import { Request, Response } from "express";
import { register_service } from "../services/register_service.js";
import { dto_data_user } from "../types/dtos_user_register.js";

export const register_controller = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password)
      throw new Error("uno o mas datos de registro no fueron enviados");

    const data: dto_data_user = {
      email: email,
      name: name,
      password: password,
    };
    const { user, token } = await register_service(data);

    res.cookie("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({
      message: "Usuario registrado con éxito.", 
      user,
    });

  } catch (error) {
    res.status(400).json(`Error al registrar usuario:${error}`);
  }
};
