export class GoogleOAuthErrorCode extends Error {
  readonly code:
    | "TOKEN_EXCHANGE_FAILED"
    | "INVALID_GOOGLE_RESPONSE"
    | "AUD_MISMATCH"
    | "USER_INFO_MISSING"
    | "AUTH_CODE_MISSING"

    constructor(code:GoogleOAuthErrorCode["code"],message?:string){
      super(message);
      this.code=code;
    
    }
}
//nota de explicacion de esta extension: cree la clase y la extendi del objeto global Error. Readonly me permite escribir los tipos y no dejar que a futuro los muten por notacion de punto, es decir, no se le pueden agregar mas que los que escribi yo. el constructor lo usamos para agregar la clase con su tipado de la misma clase, se retroalimenta para evitar duplicados, por eso llamo a code en los corchetes. message esta para ser completado en cada error y para los logs, super me da el acceso a this y con este llego a todas las propiedades de error. 