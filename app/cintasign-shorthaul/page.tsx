import CintasignShorthaulForm from '@/components/forms/cintasign-shorthaul-form'
import { SiteHeader } from '@/components/site-header'

export const metadata = {
    title: 'Cintasign Shorthaul | Ringomode HSE',
    description: 'Shorthaul logistics and trip sheet form.',
}

export default function CintasignShorthaulPage() {
    return (
        <div className="min-h-screen bg-background">
            <SiteHeader role="user" />
            <CintasignShorthaulForm />
        </div>
    )
}
