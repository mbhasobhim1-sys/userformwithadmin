"use client"

import { SiteHeader } from "@/components/site-header"
import LowbedStepDeckForm from "@/components/forms/lowbed-step-deck-form"

export default function LowbedStepDeckPage() {
    return (
        <div className="min-h-screen bg-[#f0f4ec]">
            <SiteHeader />
            <div className="container mx-auto py-8">
                <LowbedStepDeckForm />
            </div>
        </div>
    )
}
