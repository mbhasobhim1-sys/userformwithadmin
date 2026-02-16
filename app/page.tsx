import { UserHomePage } from "@/components/user-home-page"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <UserHomePage />
    </div>
  )
}
