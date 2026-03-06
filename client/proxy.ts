{/*import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
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
};*/}

//El proxy queda comentado para correr solo en desarrollo y testeos. En produccion las cookies de otros dominios, como los que creo en el servidor, no son visible por nextjs por motivos de seguridad del navegador, y tampoco me sirve setear el dominio en la creacion de la cookie en el servidor ya que necesito un dominio comprado, no uno gestionado por plataforma como vercel. La solucion es usar /me como proteccion real de app  a /chat y una validacion para UX a /forms