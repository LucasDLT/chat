import z from "zod"

export const data_schema = z.object( {
  id_token: z.string(),
  token_type: z.string(),
  scope: z.string(),
  expires_in: z.number(),
  access_token: z.string()
})