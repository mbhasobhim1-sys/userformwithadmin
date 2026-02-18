"use client"

import PonsseBisonForm from "@/components/forms/ponsse-bison-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function PonsseBisonPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[#f0f4ec] py-12 px-4 sm:px-6 lg:px-8">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-8 hover:bg-white/50 gap-2"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Button>
            <PonsseBisonForm />
        </div>
    )
}
