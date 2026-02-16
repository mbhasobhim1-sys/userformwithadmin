import { SiteHeader } from '@/components/site-header';
import { DailyAttachmentChecklistForm } from '@/components/forms/daily-attachment-checklist-form';

export default function DailyAttachmentChecklistPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gray-50 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-5xl px-4">
          <DailyAttachmentChecklistForm />
        </div>
      </main>
    </>
  );
}
