import { Request, Response } from "express";
import { service_auth_google } from "../services/auth_google.service.js";

export const auth_google = async (req: Request, res: Response) => {
  try {
    const { state, url } = await service_auth_google();

    res.cookie("state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 5 * 60 * 1000,
    }); //nota: eso son 5 min
    res.redirect(url);
  } catch (error) {
  res.redirect(`http://localhost:3000/login/error?message=${encodeURIComponent("Error al iniciar sesión con Google")}`);
  }
};

