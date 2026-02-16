"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ClipboardList, LayoutDashboard, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "@/components/logout-button"

interface SiteHeaderProps {
  role?: "user" | "admin"
}

export function SiteHeader({ role }: SiteHeaderProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Determine role from session if not provided
  const userRole = role || (session?.user?.role === "admin" ? "admin" : "user")
  const userName = session?.user?.name || "User"
  const userEmail = session?.user?.email || ""
  // Normalize display role
  const displayRole = userRole === "admin" ? "Admin" : "User"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href={userRole === "admin" ? "/admin" : "/"} className="flex items-center gap-3">
            <Image
              src="/images/ringomode-logo.png"
              alt="Ringomode DSP logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>

        <nav className="flex items-center gap-1">
          {userRole === "user" ? (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "gap-2 text-muted-foreground",
                pathname === "/" && "bg-primary/10 text-primary"
              )}
            >
              <Link href="/">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Checklists</span>
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "gap-2 text-muted-foreground",
                pathname === "/admin" && "bg-primary/10 text-primary"
              )}
            >
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </Button>
          )}

          {/* Admin-only: View User Submissions */}
          {userRole === "admin" && (
            <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
              <Link href="/">
                <>
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">User View</span>
                </>
              </Link>
            </Button>
          )}

          {/* User: View Admin (if needed) - disabled by default */}
          {/* Uncomment to allow users to see admin:
          {userRole === "user" && (
            <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
              <Link href="/admin">
                <>
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </>
              </Link>
            </Button>
          )}
          */}

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </DropdownMenuTrigger>


            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
                <p className="text-xs text-muted-foreground">
                  Role: <span className="font-semibold">{displayRole}</span>
                </p>
              </div>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}

