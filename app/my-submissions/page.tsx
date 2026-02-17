import { MySubmissionsPanel } from '@/components/my-submissions-panel'
import { SiteHeader } from '@/components/site-header'

export const metadata = {
  title: 'My Submissions | Ringomode HSE',
  description: 'Your submitted inspection forms',
}

export default function MySubmissionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <main className="mx-auto max-w-4xl p-4 lg:p-8">
        <h1 className="text-2xl font-bold mb-4">My Submissions</h1>
        <MySubmissionsPanel />
      </main>
    </div>
  )
}
