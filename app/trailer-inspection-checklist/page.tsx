
import TrailerExclLabourInspectionChecklistForm from '@/components/forms/trailer-inspection-checklist-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Trailer (Excluding Labour) Checklist | Ringomode',
    description: 'Digital checklist for trailer inspections',
};

export default function TrailerInspectionChecklistPage() {
    return (
        <div className="container mx-auto py-6">
            <TrailerExclLabourInspectionChecklistForm />
        </div>
    );
}
