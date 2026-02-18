import PressureWasherForm from "@/components/forms/pressure-washer-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
    title: "Pressure Washer Checklist | Ringomode HSE",
    description: "Complete your pressure washer inspection checklist.",
}

export default function PressureWasherChecklistPage() {
    return (
        <div className="min-h-screen bg-background">
            <SiteHeader role="user" />
            <PressureWasherForm />
        </div>
    )
}
