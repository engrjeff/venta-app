import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function QuickNewButton() {
  return (
    <Button size="sm" variant="secondary" className="w-full rounded-full">
      <PlusIcon className="mr-3 size-4" /> New
    </Button>
  )
}
