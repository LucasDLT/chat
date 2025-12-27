import { ID_CLIENT, SECRET_CLIENT } from "../envs";
let jwt = require("jsonwebtoken");

interface dtoCallback {
  name: string;
  email: string;
  google_id: string;
  token: string;
}
interface data {
  id_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  access_token: string;
}
interface payload {
  sub: string;
  email: string;
  name: string;
  aud: string;
}
export const service_auth_google_callback = async (code: string) => {
  if (!code) {
    throw new Error("No se recibe auth-code en service_callback");
  }
  const client_id = ID_CLIENT;
  const client_secret = SECRET_CLIENT;
  if (client_id && client_secret) {
    const form = new URLSearchParams({
      client_id: client_id,
      client_secret: client_secret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:3001/api/auth/google/callback",
    });

    const response = await fetch(`https://oauth2.googleapis.com/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
    const data: data = (await response.json()) as data; // esta es la unica asercion permitida ya que json retorna siempre unknow entonces al haber sacado los datos para la interface directo de un log que hice, hago la asercion confiando en esos datos y con esto conecto con mi interface
    const id_token = data.id_token;
    const access_token = data.access_token;
    if (!id_token) {
      throw new Error("Error al acceder al id_token");
    }

    const decode = jwt.decode(id_token);

    if (!decode || typeof decode !== "object") {
      throw new Error("error al decodificar el token, no llego un objeto");
    }

    const { sub, email, name, aud } = decode as payload; //en este caso la asercion esta solo por el destructuring
    if (client_id !== aud) {
      throw new Error(
        "Error en la validacion de aud, llega informacion de otro client_id"
      );
    }

    const dataToController: dtoCallback = {
      name: name,
      email: email,
      google_id: sub,
      token: access_token,
    };
    return dataToController;
  }
};
