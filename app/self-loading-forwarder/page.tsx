"use client"

import { SiteHeader } from "@/components/site-header"
import SelfLoadingForwarderForm from "@/components/forms/self-loading-forwarder-form"

export default function SelfLoadingForwarderPage() {
    return (
        <div className="min-h-screen bg-[#f0f4ec]">
            <SiteHeader />
            <div className="container mx-auto py-8">
                <SelfLoadingForwarderForm />
            </div>
        </div>
    )
}
