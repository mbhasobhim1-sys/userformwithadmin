'use client'

import { signOut } from 'next-auth/react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive cursor-pointer">
      <LogOut className="h-4 w-4" />
      <span>Sign Out</span>
    </DropdownMenuItem>
  )
}
