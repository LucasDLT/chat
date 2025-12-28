import z from "zod"

export const payload = z.object ({
  sub: z.string(),
  email: z.string(),
  name: z.string(),
  aud: z.string()
})

//a este schema tengo que exportarlo por que el payload no puedo traerlo para parsearlo