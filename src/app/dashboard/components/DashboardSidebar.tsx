import {
  SidebarProvider,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarContent,
  SidebarGroup,
  Sidebar
} from '@/components/ui/sidebar'
import React from 'react'
import {
  LayoutDashboardIcon,
  BarChart4Icon,
  FileTextIcon,
  StarIcon,
  LogOutIcon,
  UserIcon,
  MailIcon
} from 'lucide-react'
import { useAuth } from '@/context/useAuth'
import { useRouter } from 'next/navigation'

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboardIcon
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
    icon: BarChart4Icon
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: FileTextIcon
  },
  {
    label: 'Favorites',
    href: '/favorites',
    icon: StarIcon
  }
]

function DashboardSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      router.push('/')
      setTimeout(() => {
        logout()
      }, 200)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
      <SidebarProvider>
        <Sidebar className="border-r border-[#042B0B] bg-[#042B0B] text-[#F7EFE6]">
          <SidebarContent className="p-0 bg-[#042B0B] text-[#F7EFE6]">
            <SidebarGroup className="p-0 bg-[#042B0B]">
              <SidebarGroupLabel className="text-[#F7EFE6] text-2xl font-bold mt-4 mb-4 px-4">
                SIERRA
              </SidebarGroupLabel>
              <SidebarGroupContent className="border-t border-[#F7EFE6] w-full p-0 bg-[#042B0B]">
                <SidebarMenu className="text-[#F7EFE6] p-4">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.label} className="mb-2">
                      <SidebarMenuButton asChild>
                        <a href={item.href} className="flex items-center w-full text-[#F7EFE6] hover:opacity-80">
                          <item.icon className="mr-2 h-5 w-5" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-[#F7EFE6] p-4 mt-auto bg-[#042B0B] text-[#F7EFE6]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <UserIcon className="h-4 w-4 text-[#F7EFE6]" />
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MailIcon className="h-4 w-4 text-[#F7EFE6]" />
                <span className="text-xs truncate">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 flex items-center gap-2 w-full bg-[#F7EFE6] text-[#042B0B] px-3 py-2 rounded hover:bg-[#e3d7c5] transition-colors text-sm"
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
  )
}

export default DashboardSidebar
