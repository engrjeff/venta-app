import bcrypt from "bcrypt"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}
