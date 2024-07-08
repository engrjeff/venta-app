import { ROLE } from "@prisma/client"
import { DefaultSession } from "next-auth"

import "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: ROLE
    email: string
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: ROLE
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: ROLE
  }
}
