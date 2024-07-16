import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function QuickNewButton() {
  return (
    <Button
      size="icon"
      variant="secondary"
      className="ml-auto size-6 shrink-0 rounded-full"
    >
      <PlusIcon className="size-3" /> <span className="sr-only">New</span>
    </Button>
  )
}
