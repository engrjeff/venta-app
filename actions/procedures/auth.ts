import { auth } from "@/auth"
import { createServerActionProcedure } from "zsa"

const requireUser = async () => {
  try {
    const session = await auth()

    if (!session?.user) throw new Error("User not authenticated")

    return {
      user: session.user,
    }
  } catch (e) {
    throw new Error("User not authenticated")
  }
}

export const authedProcedure =
  createServerActionProcedure().handler(requireUser)
