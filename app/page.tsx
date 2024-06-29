import Image from "next/image"
import Link from "next/link"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function IndexPage() {
  return (
    <main className="container flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div>Your Stores</div>
      <div className="grid grid-cols-4">
        <Link href="/cofaith/dashboard">
          <Card className="hover:border-primary">
            <CardHeader className="space-y-4">
              <Image
                src="/cofaith-logo.png"
                alt="cofaith"
                width={32}
                height={32}
              />
              <CardTitle>CoFaith</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </main>
  )
}
