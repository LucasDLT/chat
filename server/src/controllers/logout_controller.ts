import { Request, Response } from "express";
import { logout_service } from "../services/logout_service";
export const logout_controller = async (req: Request, res: Response) => {
  try {
    const id = req.id;
    if (!id) {
      throw new Error("Error de conexion, intente nuevamente");
    }
    res.clearCookie("login_session",{
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });
    res.clearCookie("login_auth_google",{
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });
    res.clearCookie("session",{
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    })
    await logout_service(id);
    res.status(200).json({ message: "sesion cerrada exitosamente" });

    
  } catch (error) {
    res.status(401).json({ message: "error al cerrar sesion" });
  }
};
