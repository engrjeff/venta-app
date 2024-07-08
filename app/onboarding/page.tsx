import { redirect } from "next/navigation"
import { auth } from "@/auth"

async function OnboardingPage() {
  const session = await auth()

  if (session?.user.onboarded) redirect("/onboarding")

  return <div>OnboardingPage</div>
}

export default OnboardingPage
