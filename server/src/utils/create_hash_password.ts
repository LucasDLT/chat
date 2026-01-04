const bcrypt = require("bcrypt");

export const hash_password = async (pass: string): Promise<string> => {
  const password = pass;
  const salt_rounds = 10;
  return await bcrypt.hash(password, salt_rounds)
};
