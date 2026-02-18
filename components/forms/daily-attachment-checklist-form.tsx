'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SignatureCanvas from 'react-signature-canvas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChecklistRadioGroup } from '@/components/checklist-radio-group';
import { ChecklistStatusBadge } from '@/components/checklist-status-badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, FileText, ArrowLeft } from 'lucide-react';
import { exportSubmissionToPDF } from '@/lib/export-utils';
import { DailyAttachmentFormData, dailyAttachmentItemsA, dailyAttachmentItemsB, dailyAttachmentItemsC, dailyAttachmentAllItems, formConfigs } from '@/lib/types';

const formConfig = formConfigs['daily-attachment-checklist'];

export function DailyAttachmentChecklistForm() {
  const signatureRef = useRef<any>(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
  }, []);

  const [formData, setFormData] = useState<DailyAttachmentFormData>({
    mechanicName: '',
    harvesterNumber: '',
    date: '',
    harvesterHours: '',
    items: {},
    hasDefects: false,
    defectDetails: '',
    signature: '',
    attachments: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [automaticNumber, setAutomaticNumber] = useState("");

  const [itemStates, setItemStates] = useState<Record<string, 'ok' | 'def' | 'na' | null>>(
    dailyAttachmentAllItems.reduce((acc, item) => {
      acc[item] = null;
      return acc;
    }, {} as Record<string, 'ok' | 'def' | 'na' | null>)
  );

  const handleInputChange = (field: keyof DailyAttachmentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemStatusChange = (itemLabel: string, status: 'ok' | 'def' | 'na') => {
    setItemStates(prev => ({
      ...prev,
      [itemLabel]: prev[itemLabel] === status ? null : status
    }));

    const hasDefects = Object.values({ ...itemStates, [itemLabel]: status }).includes('def');
    setFormData(prev => ({
      ...prev,
      hasDefects
    }));
  };

  const handleClearSignature = () => {
    signatureRef.current?.clear();
  };

  const calculateCompletion = () => {
    const responses = Object.values(itemStates);
    const responded = responses.filter(r => r !== null).length;
    return Math.round((responded / dailyAttachmentAllItems.length) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.mechanicName || !formData.harvesterNumber || !formData.date) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (calculateCompletion() < 100) {
      toast.error('Please answer all checklist items before submitting.');
      return;
    }

    if (formData.hasDefects && (!formData.defectDetails || !formData.defectDetails.trim())) {
      toast.error('Please provide details for the defects');
      return;
    }

    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error('Please sign the form before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate Auto Number
      const autoNum = Math.floor(2000 + Math.random() * 9000).toString();
      setAutomaticNumber(autoNum);

      const signature = signatureRef.current.toDataURL();
      const itemsData = dailyAttachmentAllItems.reduce((acc, item) => {
        acc[item] = (itemStates[item] as 'ok' | 'def' | 'na') || 'ok';
        return acc;
      }, {} as Record<string, 'ok' | 'def' | 'na'>);

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'daily-attachment-checklist',
          formTitle: 'Daily Attachment Checklist',
          submittedBy: formData.mechanicName,
          hasDefects: formData.hasDefects,
          data: {
            ...formData,
            items: itemsData,
            automaticNumber: autoNum,
            signature,
          },
        }),
      });

      if (response.status === 401) {
        toast.error('Session expired — please sign in');
        router.push(`/login?callbackUrl=${pathname}`);
        return;
      }

      if (response.ok) {
        const result = await response.json();
        setSubmissionId(result.id);
        setIsSuccess(true);
        toast.success(`Submitted! Auto Number: ${autoNum}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const body = await response.json().catch(() => null);
      toast.error(body?.error || 'Failed to submit checklist');
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completion = calculateCompletion();

  const handleDownload = () => {
    exportSubmissionToPDF({
      id: submissionId || 'temp',
      formType: 'daily-attachment-checklist',
      submittedBy: formData.mechanicName,
      submittedAt: new Date().toISOString(),
      formTitle: 'Daily Attachment Checklist',
      hasDefects: formData.hasDefects,
      data: {
        ...formData,
        items: itemStates,
        automaticNumber,
        signature: formData.signature || signatureRef.current?.toDataURL(),
      }
    } as any);
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="rounded-full bg-green-100 p-6">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Submission Successful!</h2>
          <p className="text-lg text-gray-500">The Daily Attachment Checklist has been recorded.</p>
          <p className="text-xl font-bold text-[#4e8c31] mt-2">Automatic Number: {automaticNumber}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            className="bg-[#fbb016] hover:bg-[#e5a014] text-black font-bold gap-2 h-12 px-8"
            onClick={handleDownload}
          >
            <FileText className="h-5 w-5" /> Download PDF
          </Button>
          <Button variant="outline" className="h-12 px-8 font-bold" onClick={() => router.push("/")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20 p-6 md:p-10 bg-white shadow-xl rounded-none my-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Left: logo */}
            <div className="flex items-start">
              <Image
                src="/images/ringomode-logo.png"
                alt="Ringomode DSP logo"
                width={160}
                height={50}
                className="object-contain"
              />
            </div>

            {/* Center: headings (stacked, centered) */}
            <div className="text-center">
              <h1 className="text-xl font-semibold text-emerald-700">HSE Management System</h1>
              <h2 className="text-xl font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-4">
                {formConfig.title}
              </h2>
            </div>

            {/* Right: completion */}
            <div className="flex flex-col items-end">
              <ChecklistStatusBadge completion={completion} />
            </div>
          </div>
        </Card>

        {/* General Instructions */}
        <Card className="p-6 border-amber-200 bg-amber-50">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">General Instructions for Checklist</h3>
          <div className="space-y-2 text-sm text-amber-900">
            <p>
              The mechanic is to conduct a 10 minute physical walkabout of machinery on a daily basis and assess the condition of the attachment.
            </p>
            <p>
              Outcome to be detailed with an "Ok" if in order and a "Def" if defective.
            </p>
            <p>
              Defective outcomes to be documented below.
            </p>
          </div>
        </Card>

        {/* Inspector Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Inspector Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mechanicName">Mechanic Name & Surname *</Label>
              <Input
                id="mechanicName"
                placeholder="Enter mechanic name"
                value={formData.mechanicName}
                onChange={e => handleInputChange('mechanicName', e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="harvesterNumber">Harvester/Machine Number *</Label>
              <Input
                id="harvesterNumber"
                placeholder="Enter harvester number"
                value={formData.harvesterNumber}
                onChange={e => handleInputChange('harvesterNumber', e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={e => handleInputChange('date', e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="harvesterHours">Harvester Hours</Label>
              <Input
                id="harvesterHours"
                placeholder="Enter hours"
                value={formData.harvesterHours}
                onChange={e => handleInputChange('harvesterHours', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Checklist Items - A. Attachments (Head) */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">A. Attachments (Head)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {dailyAttachmentItemsA.map((item, index) => (
              <ChecklistRadioGroup
                key={`A-${index}-${item}`}
                label={`${index + 1}. ${item}`}
                value={itemStates[item]}
                onChange={status => handleItemStatusChange(item, status as 'ok' | 'def' | 'na')}
                index={index}
              />
            ))}
          </div>
        </Card>

        {/* Checklist Items - B. Attachment (Grab) */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">B. Attachment (Grab)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-72 overflow-y-auto">
            {dailyAttachmentItemsB.map((item, index) => (
              <ChecklistRadioGroup
                key={`B-${index}-${item}`}
                label={`${index + 1}. ${item}`}
                value={itemStates[item]}
                onChange={status => handleItemStatusChange(item, status as 'ok' | 'def' | 'na')}
                index={index}
              />
            ))}
          </div>
        </Card>

        {/* Checklist Items - C. Attachment (Winch) */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">C. Attachment (Winch)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
            {dailyAttachmentItemsC.map((item, index) => (
              <ChecklistRadioGroup
                key={`C-${index}-${item}`}
                label={`${index + 1}. ${item}`}
                value={itemStates[item]}
                onChange={status => handleItemStatusChange(item, status as 'ok' | 'def' | 'na')}
                index={index}
              />
            ))}
          </div>
        </Card>

        {/* Defects Section */}
        {/* Are there any defects selected + details */}
        <Card className="p-6">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-60">
              <label className="block text-sm font-medium text-gray-700 mb-1">Are There Any Defects Selected</label>
              <Select
                onValueChange={(val) => setFormData(prev => ({ ...prev, hasDefects: val === 'yes' }))}
                value={formData.hasDefects ? 'yes' : 'no'}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <label className="block mb-2 text-sm font-medium text-gray-700">Details of Defects (If "Def" is selected, please specify defects here)</label>
          <textarea
            value={formData.defectDetails}
            onChange={e => handleInputChange('defectDetails', e.target.value)}
            placeholder="Describe defects in detail..."
            className="w-full px-3 py-2 border border-gray-300 rounded-none text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={5}
          />
        </Card>

        {/* Signature */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Signature</h3>
          <div className="border-2 border-gray-300 rounded-none overflow-hidden bg-white w-full max-w-lg">
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              canvasProps={{
                width: 600,
                height: 150,
                className: 'w-full touch-none cursor-crosshair'
              }}
              backgroundColor="white"
            />
          </div>
          <div className="flex justify-between mt-3">
            <div />
            <Button
              type="button"
              variant="outline"
              onClick={handleClearSignature}
            >
              Clear
            </Button>
          </div>
        </Card>
        {/* Footer - document metadata */}
        <div className="flex items-center justify-between py-4 border-t border-gray-100 mt-8 pt-8">
          <div className="text-sm font-bold text-gray-900">
            Automatic Number: <span className="text-gray-400 italic">Generated on Submit</span>
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="outline" className="h-12 px-8 font-bold rounded-none" onClick={() => router.push('/')}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || completion < 100} className="bg-[#fbb016] hover:bg-[#e5a014] text-black font-extrabold h-12 px-12 rounded-none">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </form >
    </div>
  );
}
