'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import SignatureCanvas from 'react-signature-canvas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChecklistRadioGroup } from '@/components/checklist-radio-group';
import { ChecklistStatusBadge } from '@/components/checklist-status-badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DailyAttachmentFormData, dailyAttachmentItemsA, dailyAttachmentItemsB, dailyAttachmentItemsC, dailyAttachmentAllItems, formConfigs } from '@/lib/types';

const formConfig = formConfigs['daily-attachment-checklist'];

export function DailyAttachmentChecklistForm() {
  const signatureRef = useRef<any>(null);
  const router = useRouter();
  const pathname = usePathname();

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

    if (formData.hasDefects && !formData.defectDetails.trim()) {
      toast.error('Please provide details for the defects');
      return;
    }

    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error('Please sign the form before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
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
          formTitle: formConfig.title,
          submittedBy: formData.mechanicName,
          hasDefects: formData.hasDefects,
          data: {
            ...formData,
            items: itemsData,
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
        toast.success('Daily Attachment Checklist submitted successfully!');
        router.push('/');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            <span className="text-sm text-gray-600 mt-1">{completion}% Complete</span>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={5}
        />
      </Card>

      {/* Signature */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Signature</h3>
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white w-full max-w-lg">
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
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-xs text-muted-foreground">Document Reference No.</label>
            <input className="mt-1 w-full rounded border px-2 py-1 text-sm bg-gray-50" value={"HSEMS / 8.1.19 / DOC / 0"} readOnly />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Author</label>
            <input className="mt-1 w-full rounded border px-2 py-1 text-sm bg-gray-50" value={"HSE MANAGER"} readOnly />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Revision</label>
            <input className="mt-1 w-full rounded border px-2 py-1 text-sm bg-gray-50" value={"1"} readOnly />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Creation Date</label>
            <input className="mt-1 w-full rounded border px-2 py-1 text-sm bg-gray-50" value={"07/03/2024"} readOnly />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Automatic Number</label>
            <input className="mt-1 w-full rounded border px-2 py-1 text-sm bg-gray-50" value={"2017"} readOnly />
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || completion < 100}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
