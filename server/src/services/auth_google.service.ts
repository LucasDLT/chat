import { randomUUID } from "crypto";
import { envs_parse

 } from "../schemas/env.schema.js";
interface dtoServiceToController{
    url:string;
    state:string;
}

export const service_auth_google = async (): Promise<dtoServiceToController> => {

  const id_client_google = envs_parse.client_id;
    const state = randomUUID();
    const redirect_uri="http://localhost:3001/api/auth/google/callback";
    const response_type="code"
    const scope="profile openid email"
    const baseUrl="https://accounts.google.com/o/oauth2/v2/auth"

      const params= new URLSearchParams({
        client_id:id_client_google,
        state:state,
        redirect_uri:redirect_uri,
        response_type:response_type,
        scope:scope,
      })
      const endpoint_auth_google=`${baseUrl}?${params}`
      const response:dtoServiceToController={
          url:endpoint_auth_google,
          state:state
      }

      return response
    
};
