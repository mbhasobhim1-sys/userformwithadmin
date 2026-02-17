"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Truck, Plus, Trash2, Calendar, User, Clock, MapPin, Hash } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { exportSubmissionToPDF } from "@/lib/export-utils"
import type { Submission, FleetEntry, BreakdownEntry } from "@/lib/types"

export default function CintasignShorthaulForm() {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        day: "",
        farm: "",
        automaticNumber: "8826",
        fleetEntries: Array(8).fill(null).map((_, i) => ({
            fleetNo: "",
            operator: "",
            shift: "",
            compartment: "",
            noOfLoads: "",
            estTons: "",
            hoursOpen: "",
            hoursClose: "",
            hoursWorked: "",
            loadsPerHour: "",
            tonsPerHour: ""
        })),
        breakdownEntries: Array(8).fill(null).map((_, i) => ({
            machineId: ((i + 1) * 10).toString(),
            operator: "",
            stop: "",
            start: "",
            details: ""
        }))
    })

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submissionData, setSubmissionData] = useState<Submission | null>(null)

    const handleFleetChange = (index: number, field: keyof FleetEntry, value: string) => {
        const newFleet = [...formData.fleetEntries]
        newFleet[index] = { ...newFleet[index], [field]: value }
        setFormData(prev => ({ ...prev, fleetEntries: newFleet }))
    }

    const handleBreakdownChange = (index: number, field: keyof BreakdownEntry, value: string) => {
        const newBreakdown = [...formData.breakdownEntries]
        newBreakdown[index] = { ...newBreakdown[index], [field]: value }
        setFormData(prev => ({ ...prev, breakdownEntries: newBreakdown }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const submission: Submission = {
            id: Math.random().toString(36).substring(2, 9),
            formType: "cintasign-shorthaul",
            submittedAt: new Date().toISOString(),
            submittedBy: "Trip Manager",
            data: formData
        }

        const existing = JSON.parse(localStorage.getItem("form_submissions") || "[]")
        localStorage.setItem("form_submissions", JSON.stringify([...existing, submission]))

        setSubmissionData(submission)
        setIsSubmitted(true)
        toast.success("Logistics report submitted successfully!")
    }

    if (isSubmitted && submissionData) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Submission Successful!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            Your Cintasign Shorthaul report has been recorded.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => exportSubmissionToPDF(submissionData)}
                                className="w-full gap-2 bg-primary hover:bg-primary/90"
                            >
                                <Image src="/images/pdf-icon.png" alt="PDF" width={20} height={20} className="invert brightness-0" />
                                Download PDF
                            </Button>
                            <Button variant="outline" onClick={() => window.location.href = "/"} className="w-full">
                                Back to Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-[1200px] p-4 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 shadow-sm ring-1 ring-gray-200">
                {/* Header Section */}
                <div className="flex flex-col items-center justify-between gap-6 border-b border-gray-100 pb-8 md:flex-row">
                    <div className="flex items-center gap-4">
                        <div className="relative h-20 w-44">
                            <Image src="/images/ringomode-logo.png" alt="Ringomode Logo" fill className="object-contain" priority />
                        </div>
                        <div className="h-12 w-[1px] bg-gray-300 mx-2" />
                        <div className="text-xl font-bold tracking-widest text-[#4e8c31]">CINTASIGN</div>
                    </div>
                    <div className="text-center md:text-right">
                        <h1 className="text-2xl font-bold tracking-tight text-[#4e8c31] lg:text-3xl underline decoration-2 underline-offset-8">
                            Cintasign Shorthaul
                        </h1>
                    </div>
                </div>

                {/* Top Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700">Date</Label>
                        <Input
                            required
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700">Day</Label>
                        <Input
                            required
                            value={formData.day}
                            onChange={e => setFormData(prev => ({ ...prev, day: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700">Farm</Label>
                        <Input
                            required
                            value={formData.farm}
                            onChange={e => setFormData(prev => ({ ...prev, farm: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-900 uppercase">Automatic Number</Label>
                        <div className="text-lg font-bold text-gray-900">{formData.automaticNumber}</div>
                    </div>
                </div>

                {/* Fleet Entries */}
                <div className="space-y-8 border-t border-gray-200 pt-8">
                    {formData.fleetEntries.map((entry, idx) => (
                        <div key={idx} className="space-y-4 border-b border-gray-100 pb-6 last:border-none">
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">Fleet No {idx + 1}</Label>
                                    <Input value={entry.fleetNo} onChange={e => handleFleetChange(idx, "fleetNo", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">Operator {idx + 1}</Label>
                                    <Input value={entry.operator} onChange={e => handleFleetChange(idx, "operator", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">Shift {idx + 1}</Label>
                                    <Input value={entry.shift} onChange={e => handleFleetChange(idx, "shift", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">Compartment {idx + 1}</Label>
                                    <Input value={entry.compartment} onChange={e => handleFleetChange(idx, "compartment", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">No Of Loads {idx + 1}</Label>
                                    <Input value={entry.noOfLoads} onChange={e => handleFleetChange(idx, "noOfLoads", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">EST. Tons {idx + 1}</Label>
                                    <Input value={entry.estTons} onChange={e => handleFleetChange(idx, "estTons", e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">Hours Open {idx + 1}</Label>
                                    <Input value={entry.hoursOpen} onChange={e => handleFleetChange(idx, "hoursOpen", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">Hours Close {idx + 1}</Label>
                                    <Input value={entry.hoursClose} onChange={e => handleFleetChange(idx, "hoursClose", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">Hours Worked {idx + 1}</Label>
                                    <Input value={entry.hoursWorked} onChange={e => handleFleetChange(idx, "hoursWorked", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">Loads Per Hour {idx + 1}</Label>
                                    <Input value={entry.loadsPerHour} onChange={e => handleFleetChange(idx, "loadsPerHour", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-700">Tons Per Hour {idx + 1}</Label>
                                    <Input value={entry.tonsPerHour} onChange={e => handleFleetChange(idx, "tonsPerHour", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Break Down Hours And Details */}
                <div className="space-y-6 border-t border-gray-200 pt-8">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-[#4e8c31] underline decoration-[#4e8c31] underline-offset-4">
                            Break Down Hours And Details
                        </h2>
                    </div>
                    <div className="grid grid-cols-5 gap-4 px-2">
                        {["Machine ID", "Operator", "Stop", "Start", "Details"].map(header => (
                            <Label key={header} className="text-[10px] font-bold text-gray-900 uppercase text-center">{header}</Label>
                        ))}
                    </div>
                    <div className="space-y-4">
                        {formData.breakdownEntries.map((entry, idx) => (
                            <div key={idx} className="grid grid-cols-5 gap-4 items-center">
                                <div className="text-xs font-bold text-gray-700 pl-2">Machine ID {entry.machineId}</div>
                                <Input className="h-8 py-1 px-2" value={entry.operator} onChange={e => handleBreakdownChange(idx, "operator", e.target.value)} />
                                <Input className="h-8 py-1 px-2" value={entry.stop} onChange={e => handleBreakdownChange(idx, "stop", e.target.value)} />
                                <Input className="h-8 py-1 px-2" value={entry.start} onChange={e => handleBreakdownChange(idx, "start", e.target.value)} />
                                <Input className="h-8 py-1 px-2" value={entry.details} onChange={e => handleBreakdownChange(idx, "details", e.target.value)} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <Button type="submit" size="lg" className="h-12 w-48 bg-[#fbb016] hover:bg-[#e5a014] text-black font-bold text-lg rounded-none">
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    )
}
