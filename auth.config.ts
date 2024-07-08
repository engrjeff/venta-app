import { AccessDenied, CredentialsSignin } from "@auth/core/errors" // import is specific to your framework
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import prisma from "./prisma/client"
import { loginSchema } from "./schema/auth"
import {
  generateVerificationToken,
  getVerificationTokenByEmail,
} from "./server/tokens"

export default {
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      async authorize(credentials, request) {
        const validation = loginSchema.safeParse(credentials)

        if (!validation.success) return null

        const { email, password } = validation.data

        const foundUser = await prisma.user.findUnique({ where: { email } })

        if (!foundUser) throw new AccessDenied("Invalid credentials.")

        if (!foundUser.emailVerified) {
          const existingVerificationToken = await getVerificationTokenByEmail(
            foundUser.email
          )

          if (existingVerificationToken) {
            if (new Date() > existingVerificationToken.expires) {
              const newToken = await generateVerificationToken(foundUser.email)

              //   await sendVerificationEmail(
              //     foundUser.name,
              //     newToken.email,
              //     newToken.token
              //   );

              throw new CredentialsSignin(
                "A confirmation link was sent to your email. Please verify your email first."
              )
            }
          }

          throw new CredentialsSignin("Please verify your email first.")
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          foundUser.hashedPassword!
        )

        if (!passwordsMatch) throw new AccessDenied("Invalid credentials.")

        const { name, email: userEmail, id, image, role } = foundUser

        return {
          name,
          email: userEmail,
          id,
          image,
          role,
        }
      },
    }),
  ],
} satisfies NextAuthConfig
