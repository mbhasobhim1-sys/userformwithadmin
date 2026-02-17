import React from "react";
import { ChecklistRadioGroup } from "../checklist-radio-group";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function TimberTruckAndTrailerChecklistForm() {
  return (
    <form className="space-y-6 p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Timber Truck And Trailer Checklist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Driver's Name</Label>
          <Input name="driverName" required />
        </div>
        <div>
          <Label>Unit Number</Label>
          <Input name="unitNumber" required />
        </div>
        <div>
          <Label>Date</Label>
          <Input name="date" type="date" required />
        </div>
        <div>
          <Label>Opening Kilometres</Label>
          <Input name="openingKm" type="number" required />
        </div>
        <div>
          <Label>Closing Kilometres</Label>
          <Input name="closingKm" type="number" required />
        </div>
        <div>
          <Label>Valid Driver's License (Exp Date)</Label>
          <Input name="licenseExpiry" type="date" required />
        </div>
        <div>
          <Label>Valid PDP (Exp Date)</Label>
          <Input name="pdpExpiry" type="date" required />
        </div>
        <div>
          <Label>Truck Registration</Label>
          <Input name="truckReg" required />
        </div>
        <div>
          <Label>Trailer Registration</Label>
          <Input name="trailerReg" required />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Checklist</h2>
        {/* ChecklistRadioGroup usage must be updated to match its props. */}
        {/* Example usage: <ChecklistRadioGroup value={value} onChange={onChange} label="Walk Around Inspection" index={0} /> */}
      </div>
      <div className="mt-8">
        <Label>Are There Any Defects Selected?</Label>
        <Input name="defectsSelected" required />
      </div>
      <div>
        <Label>Details of Defects (If "Def" is selected, please specify defects here)</Label>
        <Input name="defectDetails" />
      </div>
      <div className="mt-8 flex flex-col gap-2">
        <Label>Signature</Label>
        {/* Signature component placeholder */}
        <div className="border rounded h-24 flex items-center justify-center text-gray-400">Signature Pad</div>
      </div>
      <div className="flex justify-end mt-8">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
