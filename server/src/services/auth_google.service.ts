import { randomUUID } from "crypto";
import { ID_CLIENT } from "../envs";

interface dtoServiceToController{
    url:string;
    state:string;
}

export const service_auth_google = async (): Promise<dtoServiceToController> => {
    const id_client_google = ID_CLIENT;
    const state = randomUUID();
    const redirect_uri="http://localhost:3001/auth/google/callback"
    const response_type="code"
    const scope="profile openid email"
    const baseUrl="https://accounts.google.com/o/oauth2/v2/auth"

    if (id_client_google) {
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
    }else{
      throw new Error("error al crear url en service auth/google")
    }  
};
