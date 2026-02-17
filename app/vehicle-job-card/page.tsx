import VehicleJobCardForm from '@/components/forms/vehicle-job-card-form'
import { SiteHeader } from '@/components/site-header'

export const metadata = {
    title: 'Vehicle Job Card | Ringomode HSE',
    description: 'Motorized equipment / vehicle job card.',
}

export default function VehicleJobCardPage() {
    return (
        <div className="min-h-screen bg-background">
            <SiteHeader role="user" />
            <VehicleJobCardForm />
        </div>
    )
}
