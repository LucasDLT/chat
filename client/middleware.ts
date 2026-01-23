import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const authenticated = req.cookies.has("login_session") || req.cookies.has("login_auth_google");

  const protect_chat= pathname.startsWith("/chat")
  const verify_forms=pathname.startsWith("/forms")
  const redirect = NextResponse.redirect(new URL("/", req.url))

  if (!authenticated && protect_chat) {
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