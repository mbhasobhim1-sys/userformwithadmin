import DailyMachineChecklistForm from '@/components/forms/daily-machine-checklist-form'
import { SiteHeader } from '@/components/site-header'

export const metadata = {
    title: 'Daily Machine Checklist | Ringomode HSE',
    description: 'Daily machine inspection and maintenance checklist.',
}

export default function DailyChecklistPage() {
    return (
        <div className="min-h-screen bg-background">
            <SiteHeader role="user" />
            <DailyMachineChecklistForm />
        </div>
    )
}
