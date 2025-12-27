import { Request, Response } from "express";
import {service_auth_google_callback} from "../services/auth_google_callback"

export const auth_google_callback = async (req: Request, res: Response) => {
  try {
    const myCookie = req.cookies.state;
    const queryCookie = req.query.state;
    const queryCode = req.query.code;
    if (!myCookie || !queryCookie || !queryCode) return;
    if (myCookie !== queryCookie) return;
    //aca averiguar si no tendria que borrar la cookie actual
    const data = await service_auth_google_callback(queryCode.toString())
    console.log("data en controller", data)

  } catch (err) {
    res.status(500).send(err);
    //o redirect a path de error del front, como en el primer controlador, podria ser un objeto este tambien, y podria venir con la url a donde redirigir
  }
};
