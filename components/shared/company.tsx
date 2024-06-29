import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Company() {
  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src="/cofaith-logo.png" alt="CoFaith" />
        <AvatarFallback>CF</AvatarFallback>
      </Avatar>
      <span className="font-bold">CoFaith</span>
    </div>
  )
}
