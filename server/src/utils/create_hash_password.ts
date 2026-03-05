import bcrypt from "bcrypt"
export const hash_password = async (pass: string): Promise<string> => {
  const password = pass;
  const salt_rounds = 10;
  return await bcrypt.hash(password, salt_rounds);
};

export const compare_password = async (pass: string, hash: string): Promise<boolean> => {
  const password = pass;
  const password_db= hash;
  return await bcrypt.compare(password, password_db);
};
