import { Request, Response } from "express";
import { me_service } from "../services/me_service.js";

export const me_controller = async (req: Request, res: Response) => {
  try {
    const id = req.id;
    if (id) {
      const user = await me_service(id)
      console.log(user);
      
      res.status(200).json({ message: "login exitoso", user });
    } else {
      throw new Error("error de conexion, intenta nuevamente");
    }
  } catch (error) {
    res.status(401).json(`Error de autenticacion: ${error}`);
  }
};
