import SkidderPreShiftInspectionForm from '@/components/forms/skidder-pre-shift-inspection-form'
import { SiteHeader } from '@/components/site-header'

export const metadata = {
  title: 'Skidder Pre-Shift Inspection | Ringomode HSE',
  description: 'Skidder pre-shift inspection checklist.',
}

export default function SkidderPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <SkidderPreShiftInspectionForm />
    </div>
  )
}
