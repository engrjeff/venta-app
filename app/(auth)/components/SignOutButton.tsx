import { signOutAction } from "@/actions/auth"

import { Button } from "@/components/ui/button"

export function SignOutButton() {
  return (
    <Button
      type="submit"
      onClick={async () => {
        await signOutAction()
      }}
    >
      Sign Out
    </Button>
  )
}
