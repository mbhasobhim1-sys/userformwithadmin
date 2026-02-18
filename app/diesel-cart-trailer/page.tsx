import DieselCartTrailerForm from "@/components/forms/diesel-cart-trailer-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"

export default function DieselCartTrailerPage() {
    return (
        <div className="min-h-screen bg-[#f0f4ec]">
            <SiteHeader />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <Link href="/">
                    <Button
                        variant="ghost"
                        className="mb-8 hover:bg-white/50 gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>
                <DieselCartTrailerForm />
            </div>
        </div>
    )
}
