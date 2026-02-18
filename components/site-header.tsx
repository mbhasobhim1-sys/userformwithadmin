"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ClipboardList, LayoutDashboard, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "@/components/logout-button"

interface SiteHeaderProps {
  role?: "user" | "admin"
}

export function SiteHeader({ role }: SiteHeaderProps) {
  const [mounted, setMounted] = useState(false)
  const [pathname, setPathname] = useState("")
  const { data: session } = useSession()

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname)
    }
  }, [])

  // Identity: Always use session as the source of truth for who the user IS
  // On the server or during hydration, we default to "user" to match the server render
  const actualRole = mounted ? (session?.user?.role || "user") : "user"
  const userName = mounted ? (session?.user?.name || "User") : "User"
  const userEmail = mounted ? (session?.user?.email || "") : ""
  const displayRole = actualRole === "admin" ? "Admin" : "User"



  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="flex h-36 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href={actualRole === "admin" ? "/admin" : "/"} className="flex items-center gap-3">
            <Image
              src="/images/ringomode-logo.png"
              alt="Ringomode DSP logo"
              width={180}
              height={60}
              className="object-contain"
            />
          </Link>

          <div className="flex items-center gap-2">
            {/* Checklists / User View Link */}
            <Button
              variant="ghost"
              size="lg"
              asChild
              className={cn(
                "gap-3 text-lg text-muted-foreground",
                pathname === "/" && "bg-primary/10 text-primary"
              )}
            >
              <Link href="/">
                <ClipboardList className="h-6 w-6" />
                <span className="hidden sm:inline">
                  {actualRole === "admin" ? "User View" : "Checklists"}
                </span>
              </Link>
            </Button>

            {/* Admin Dashboard Link */}
            {actualRole === "admin" && (
              <Button
                variant="ghost"
                size="lg"
                asChild
                className={cn(
                  "gap-3 text-lg text-muted-foreground",
                  pathname === "/admin" && "bg-primary/10 text-primary"
                )}
              >
                <Link href="/admin">
                  <LayoutDashboard className="h-6 w-6" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="lg" className="gap-3 text-lg text-muted-foreground">
                <User className="h-6 w-6" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </DropdownMenuTrigger>


            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                  <p className="text-xs text-muted-foreground">
                    Role: <span className="font-semibold">{displayRole}</span>
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}

