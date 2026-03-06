import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const authenticated = req.cookies.has("login_session") || req.cookies.has("login_auth_google");

  const protect_chat= pathname.startsWith("/chat")
  const verify_forms=pathname.startsWith("/forms")
  const redirect = NextResponse.redirect(new URL("/", req.url))

  if (authenticated && protect_chat) {//voy a quitar el ! para verificar si esta produciendo una falla
    return redirect
  }
  if (authenticated && verify_forms) {
    return redirect
  }

  return NextResponse.next()
}
export const config = {
  matcher: ["/chat", "/forms"],
};