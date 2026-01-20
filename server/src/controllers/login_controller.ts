import { Request, Response } from "express";
import { login_service } from "../services/login_service.js";
import { dto_data_login } from "../types/dtos_user_register.js";

export const login_controller = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;
    if (!password || !email)
      throw new Error("Es necesario que ingrese name y password");

    const data: dto_data_login = {
      email: email,
      password: password,
    };

    const { user, token } = await login_service(data);

    res.cookie("login_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
 
    res.status(200).json({
      message: "Login Exitoso.",
      user,
    });
  } catch (error) {
    res.status(400).json(`Error al loguearse: ${error}`)
  }
};
