import { Request, Response } from "express";
import { service_auth_google_callback } from "../services/auth_google_callback";
import { GoogleOAuthErrorCode } from "../types/google_auth.error";
import { switch_error } from "../utils/custom_error_google";

export const auth_google_callback = async (req: Request, res: Response) => {
  try {
    const myCookie = req.cookies.state;
    const queryCookie = req.query.state;
    const queryCode = req.query.code;

    if (!myCookie || !queryCookie || !queryCode) return;
    if (myCookie !== queryCookie) return;

    res.clearCookie("state", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 5 * 60 * 1000,
      path: "/",
    });
    //para desarrollo sameSite: "lax" y secure false. En produccion sameSite: "none" y secure true.
    const { token } = await service_auth_google_callback(queryCode.toString());

    res.cookie("login_auth_google", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    res.redirect("https://livechat-ls.vercel.app/chat");
  } catch (err) {
    if (err instanceof GoogleOAuthErrorCode) {
      switch_error(err, res);
      res.redirect("https://livechat-ls.vercel.app/error");
    }
  }
};
