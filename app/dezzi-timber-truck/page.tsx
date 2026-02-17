import DezziTimberTruckForm from "@/components/forms/dezzi-timber-truck-form"

export const metadata = {
    title: "Dezzi Timber Truck Pre-Shift Checklist | Ringomode",
    description: "Complete your pre-shift Dezzi timber truck inspection checklist.",
}

export default function DezziTimberTruckPage() {
    return (
        <div className="container py-8">
            <DezziTimberTruckForm />
        </div>
    )
}
