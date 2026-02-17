import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function VehicleJobCardForm() {
  return (
    <form className="space-y-6 p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Motorized Equipment/Vehicle Job Card</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Driver's Name</Label>
          <Input name="driverName" required />
        </div>
        <div>
          <Label>Machine/Vehicle</Label>
          <Input name="machineVehicle" required />
        </div>
        <div>
          <Label>Date</Label>
          <Input name="date" type="date" required />
        </div>
        <div>
          <Label>Job Card No.</Label>
          <Input name="jobCardNo" required />
        </div>
        <div>
          <Label>Machine/Registration Number</Label>
          <Input name="registrationNumber" required />
        </div>
        <div>
          <Label>Hour Meter / KM Reading</Label>
          <Input name="hourMeter" required />
        </div>
        <div>
          <Label>Category of Work</Label>
          <Input name="categoryOfWork" required placeholder="Service / Breakdown / MCA / Other" />
        </div>
      </div>
      <div className="mt-8">
        <Label>Description of Work Performed</Label>
        <Input name="workDescription" required />
      </div>
      <div>
        <Label>Test Performed and Resulted</Label>
        <Input name="testResult" />
      </div>
      <div>
        <Label>Job completed and safe to use</Label>
        <Input name="jobCompleted" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div>
          <Label>Mechanic's Name</Label>
          <Input name="mechanicName" />
        </div>
        <div>
          <Label>Operator's Name</Label>
          <Input name="operatorName" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <Label>Mechanic's Signature</Label>
          <div className="border rounded h-24 flex items-center justify-center text-gray-400">Signature Pad</div>
        </div>
        <div>
          <Label>Operator's Signature</Label>
          <div className="border rounded h-24 flex items-center justify-center text-gray-400">Signature Pad</div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Mechanics Job Card - Time</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Time On</Label>
            <Input name="timeOn" type="time" />
          </div>
          <div>
            <Label>Time Off</Label>
            <Input name="timeOff" type="time" />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Labour</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Normal Time Hours</Label>
            <Input name="normalTimeHours" type="number" />
          </div>
          <div>
            <Label>Over Time Hours</Label>
            <Input name="overTimeHours" type="number" />
          </div>
          <div>
            <Label>Total Hours</Label>
            <Input name="totalHours" type="number" />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Travel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Normal Time Kilometers</Label>
            <Input name="normalTimeKm" type="number" />
          </div>
          <div>
            <Label>Over Time Kilometers</Label>
            <Input name="overTimeKm" type="number" />
          </div>
          <div>
            <Label>Total Kilometers</Label>
            <Input name="totalKm" type="number" />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
