import { Request, Response } from "express";
import { service_auth_google } from "../services/auth_google.service";

export const auth_google = async (req: Request, res: Response) => {
  try {
    const {state, url} = await service_auth_google();

    res.cookie("state", state, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 5 * 60 * 1000 });//nota: eso son 5 min
    res.status(200);
    res.redirect(url);

  } catch (error) {
    res.status(500).send(error);// el error podria ser un objeto, de momento lo dejo asi y luego lo reviso. 
  }
};
