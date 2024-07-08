import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email." })
    .min(1, { message: "Email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
})

export const registerSchema = loginSchema.extend({
  name: z.string().min(1),
})

export type LoginFormInput = z.infer<typeof loginSchema>

export type RegisterFormInput = z.infer<typeof registerSchema>
