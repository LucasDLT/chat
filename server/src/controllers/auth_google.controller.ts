import { Request, Response } from "express";
import { service_auth_google } from "../services/auth_google.service";

export const auth_google = async (req: Request, res: Response) => {
  try {
    const redirect_url = await service_auth_google();
    //aca faltaria la logica para guardar el state en algun lugar
    
    res.redirect(redirect_url.url);
  } catch (error) {
    console.log(error);
  }
};
