import WeeklyMachineryConditionForm from '@/components/forms/weekly-machinery-condition-form'
import { SiteHeader } from '@/components/site-header'

export const metadata = {
    title: 'Weekly Machinery Assessment | Ringomode HSE',
    description: 'Weekly machinery condition assessment checklist.',
}

export default function WeeklyAssessmentPage() {
    return (
        <div className="min-h-screen bg-background">
            <SiteHeader role="user" />
            <WeeklyMachineryConditionForm />
        </div>
    )
}
