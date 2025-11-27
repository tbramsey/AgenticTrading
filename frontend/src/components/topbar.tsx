import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TopBar() {
  return (
    <header className="h-16 w-full bg-background border-b border-border flex items-center px-6 gap-6">

      {/* Search Bar */}
      <div className="flex-1 flex justify-center py-2">
        <Input
          className="w-1/2 rounded-xl"
          placeholder="Search…"
        />
      </div>

      {/* User */}
      <div className="flex items-center gap-3">
        <span className="font-medium text-foreground">Jack Sparrow</span>

        <Avatar className="bg-primary text-primary-foreground">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>

      </div>
    </header>
  )
}
