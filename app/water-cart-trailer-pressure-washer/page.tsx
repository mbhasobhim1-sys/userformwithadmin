import WaterCartTrailerPressureWasherForm from '@/components/forms/water-cart-trailer-pressure-washer-form'
import { SiteHeader } from '@/components/site-header'

export const metadata = {
    title: 'Water Cart Trailer & Pressure Washer | Ringomode HSE',
    description: 'Water Cart Trailer & Pressure Washer inspection checklist.',
}

export default function WaterCartPage() {
    return (
        <div className="min-h-screen bg-background">
            <SiteHeader role="user" />
            <WaterCartTrailerPressureWasherForm />
        </div>
    )
}
