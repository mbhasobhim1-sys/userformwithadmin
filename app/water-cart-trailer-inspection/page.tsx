import WaterCartTrailerInspectionForm from "@/components/forms/water-cart-trailer-inspection-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
    title: "Water Cart Trailer Inspection Checklist | Ringomode HSE",
    description: "Complete your daily water cart trailer inspection checklist.",
}

export default function WaterCartTrailerInspectionPage() {
    return (
        <div className="min-h-screen bg-background">
            <SiteHeader role="user" />
            <WaterCartTrailerInspectionForm />
        </div>
    )
}
