"use server"

import { signIn, signOut } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { loginSchema } from "@/schema/auth"
import { AuthError } from "next-auth"
import { createServerAction } from "zsa"

export const signOutAction = createServerAction().handler(async () => {
  await signOut({
    redirectTo: "/signin",
  })
})

export const login = createServerAction()
  .input(loginSchema, { type: "formData" })
  .handler(async ({ input }) => {
    try {
      await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      })
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "AccessDenied":
            throw new Error("Invalid credentials.")
        }
      }

      throw error
    }
  })
