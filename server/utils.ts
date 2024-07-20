import bcrypt from "bcrypt"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export function appendCurrency(input: any) {
  if (!input) return ["₱", "0.00"].join(" ")

  return ["₱", Number(input).toFixed(2)].join(" ")
}
