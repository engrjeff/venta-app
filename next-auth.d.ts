import { ROLE } from "@prisma/client"
import { DefaultSession } from "next-auth"

import "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: ROLE
    email: string
    onboarded: boolean
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: ROLE
      onboarded: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: ROLE
  }
}
