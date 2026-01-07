import { Request, Response } from "express";
import { service_auth_google_callback } from "../services/auth_google_callback.js";
import { GoogleOAuthErrorCode } from "../types/google_auth.error.js";
import { switch_error } from "../utils/custom_error_google.js";

export const auth_google_callback = async (req: Request, res: Response) => {
  try {
    const myCookie = req.cookies.state;
    const queryCookie = req.query.state;
    const queryCode = req.query.code;

    if (!myCookie || !queryCookie || !queryCode) return;
    if (myCookie !== queryCookie) return;

    res.clearCookie("state", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    const { user, token } =
      await service_auth_google_callback(queryCode.toString());

    res.cookie("login_auth_google", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

{/*    res.status(200).json({
      message:"usuario registrado con google",
      user
    })*/}
    res.redirect("http://localhost:3000/chat")

     
  } catch (err) {
    if (err instanceof GoogleOAuthErrorCode) {
      switch_error(err, res);
      res.redirect("http://localhost:3000/error")
    }
  }
};
