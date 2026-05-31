import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import useAuth from "@/hooks/useAuth"
import { LogOut, UserCircle } from "lucide-react"
import { Link } from "react-router-dom"

const AppSidebarFooter = () => {
  const { authUser, signOut } = useAuth()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent"
              size="lg"
            >
              <Avatar>
                <AvatarImage src={authUser?.profile_img} alt="profile" />
                <AvatarFallback>
                  {authUser?.username.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="grid">
                <span className="truncate font-medium">
                  {authUser?.username}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <div className="flex gap-2">
                <Avatar>
                  <AvatarImage src={authUser?.profile_img} alt="profile" />
                  <AvatarFallback>
                    {authUser?.username.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid">
                  <span className="truncate font-medium">
                    {authUser?.username}
                  </span>
                  <span className="truncate text-xs">{authUser?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <UserCircle />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={signOut}>
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default AppSidebarFooter
