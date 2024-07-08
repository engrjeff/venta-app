import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getStores } from "@/actions/stores"
import { auth } from "@/auth"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default async function IndexPage() {
  const session = await auth()

  if (!session?.user.onboarded) redirect("/onboarding")

  const [stores] = await getStores()

  return (
    <main className="container flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div>Hi, {session.user.name}!</div>
      <hr />
      <div>Your Stores</div>
      <div className="grid grid-cols-4 gap-4">
        {stores?.map((store) => (
          <Link key={store.id} href={`/${store.slug}/dashboard`}>
            <Card className="hover:border-primary">
              <CardHeader className="space-y-4">
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={32}
                  height={32}
                />
                <CardTitle className="text-lg font-semibold">
                  {store.name}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
