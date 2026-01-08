import { Request, Response } from "express";

export const me_controller = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    if (user) {
      res.status(200).json({ message: "login exitoso", user });
    } else {
      throw new Error("error de conexion, intenta nuevamente");
    }
  } catch (error) {
    res.status(400).json(`Error al loguearse: ${error}`);
  }
};
