"use client"

import React, { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Calendar, User, Truck, Clock, Hammer, ShieldCheck, Signature as SignatureIcon, PenTool, ClipboardCheck, FileText, Send, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { exportSubmissionToPDF } from "@/lib/export-utils"
import type { Submission, VehicleJobCardFormData } from "@/lib/types"

const drivers = [
    "A. Khumalo", "S. Mthethwa", "J. Naidoo", "M. Sibiya", "L. Dlamini",
    "P. Govender", "N. Zondi", "B. Cele", "R. Pillay", "T. Gumede",
    "W. Mkhize", "K. Ndlovu"
]

export default function VehicleJobCardForm() {
    const router = useRouter()
    const mechanicSignRef = useRef<HTMLCanvasElement>(null)
    const operatorSignRef = useRef<HTMLCanvasElement>(null)

    const [formData, setFormData] = useState<VehicleJobCardFormData>({
        date: new Date().toISOString().split("T")[0],
        driversName: "",
        machineVehicle: "",
        hourMeterKmReading: "",
        jobCardNo: `JC-${Math.floor(1000 + Math.random() * 9000)}`,
        machineRegistrationNumber: "",
        categoryOfWork: "",
        descriptionOfWorkPerformed: "",
        testPerformedAndResulted: "",
        jobCompletedAndSafeToUse: "No",
        mechanicsName: "",
        operatorsName: "",
        mechanicsSignature: "",
        operatorsSignature: "",
        timeOn: "",
        timeOff: "",
        normalTimeHours: "",
        overTimeHours: "",
        totalHours: "",
        normalTimeKilometers: "",
        overTimeKilometers: "",
        totalKilometers: "",
        automaticNumber: "",
    })

    const [automaticNumber, setAutomaticNumber] = useState("")

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submissionData, setSubmissionData] = useState<Submission | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Drawing state for signatures
    const [isDrawingMechanic, setIsDrawingMechanic] = useState(false)
    const [isDrawingOperator, setIsDrawingOperator] = useState(false)

    useEffect(() => {
        const setupCanvas = (canvas: HTMLCanvasElement | null) => {
            if (canvas) {
                const ctx = canvas.getContext("2d")
                if (ctx) {
                    ctx.strokeStyle = "#000"
                    ctx.lineWidth = 2
                    ctx.lineCap = "round"
                }
            }
        }
        setupCanvas(mechanicSignRef.current)
        setupCanvas(operatorSignRef.current)
    }, [])

    const startDrawing = (canvas: HTMLCanvasElement | null, setDrawing: (d: boolean) => void, e: React.MouseEvent | React.TouchEvent) => {
        setDrawing(true)
        if (canvas) drawOne(canvas, true, e)
    }

    const stopDrawing = (canvas: HTMLCanvasElement | null, setDrawing: (d: boolean) => void, field: "mechanicsSignature" | "operatorsSignature") => {
        setDrawing(false)
        if (canvas) {
            const newData = canvas.toDataURL()
            setFormData(prev => ({ ...prev, [field]: newData }))
        }
    }

    const drawOne = (canvas: HTMLCanvasElement | null, isDrawing: boolean, e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left
        const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top

        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    const clearOneSignature = (canvas: HTMLCanvasElement | null, field: "mechanicsSignature" | "operatorsSignature") => {
        const ctx = canvas?.getContext("2d")
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            setFormData(prev => ({ ...prev, [field]: "" }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.mechanicsSignature || !formData.operatorsSignature) {
            toast.error("Both Mechanic and Operator signatures are required.")
            return
        }

        setIsSubmitting(true)

        // Generate Auto Number
        const autoNum = Math.floor(2000 + Math.random() * 9000).toString()
        setAutomaticNumber(autoNum)

        try {
            const submission = {
                formType: "vehicle-job-card",
                formTitle: "Motorized Equipment/Vehicle Job Card",
                submittedBy: formData.mechanicsName || "Mechanic",
                submittedAt: new Date().toISOString(),
                hasDefects: false,
                data: {
                    ...formData,
                    automaticNumber: autoNum
                },
            }

            const response = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submission),
            })

            if (response.status === 401) {
                toast.error("Session expired — please sign in")
                return
            }

            if (response.ok) {
                const result = await response.json()
                setSubmissionData({ ...submission, id: result.id })
                toast.success("Job card submitted successfully!")
                setIsSubmitted(true)
                window.scrollTo({ top: 0, behavior: "smooth" })
            } else if (response.status === 403) {
                toast.error("Forbidden — you do not have permission to submit this form")
            } else {
                const body = await response.json().catch(() => null)
                toast.error(body?.error || "Failed to submit checklist")
            }
        } catch {
            toast.error("An error occurred. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted && submissionData) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="rounded-full bg-green-100 p-6">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Submission Successful!</h2>
                    <p className="text-lg text-gray-500">The Motorized Equipment/Vehicle Job Card has been recorded.</p>
                    <p className="text-xl font-bold text-[#4e8c31] mt-2">Automatic Number: {automaticNumber}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                        className="bg-[#fbb016] hover:bg-[#e5a014] text-black font-bold gap-2 h-12 px-8"
                        onClick={() => exportSubmissionToPDF(submissionData)}
                    >
                        <FileText className="h-5 w-5" /> Download PDF
                    </Button>
                    <Button variant="outline" className="h-12 px-8 font-bold" onClick={() => router.push("/")}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-5xl bg-white p-4 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header Section */}
                <Card className="p-6 rounded-none border-none shadow-none text-center md:text-left">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row border-b-2 border-[#4e8c31] pb-6">
                        <div className="relative h-20 w-48">
                            <Image
                                src="/images/ringomode-logo.png"
                                alt="Ringomode Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#4e8c31] lg:text-3xl uppercase">
                                HSE Management System
                            </h1>
                            <h2 className="text-xl font-bold text-[#4e8c31] uppercase">
                                Motorized Equipment/Vehicle Job Card
                            </h2>
                        </div>
                    </div>
                </Card>

                {/* Job Info Grid */}
                <Card className="p-6 rounded-none border-gray-200">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Driver's Name</Label>
                            <Select
                                value={formData.driversName}
                                onValueChange={(val) => setFormData(prev => ({ ...prev, driversName: val }))}
                                required
                            >
                                <SelectTrigger className="rounded-none border-gray-300">
                                    <SelectValue placeholder="Select Driver" />
                                </SelectTrigger>
                                <SelectContent>
                                    {drivers.map(d => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Machine / Vehicle</Label>
                            <Input
                                required
                                value={formData.machineVehicle}
                                onChange={e => setFormData(prev => ({ ...prev, machineVehicle: e.target.value }))}
                                className="rounded-none border-gray-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Hour Meter / KM Reading</Label>
                            <Input
                                required
                                value={formData.hourMeterKmReading}
                                onChange={e => setFormData(prev => ({ ...prev, hourMeterKmReading: e.target.value }))}
                                className="rounded-none border-gray-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Job Card No.</Label>
                            <Input
                                readOnly
                                value={formData.jobCardNo}
                                className="rounded-none border-gray-300 bg-gray-50 font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Registration Number</Label>
                            <Input
                                required
                                value={formData.machineRegistrationNumber}
                                onChange={e => setFormData(prev => ({ ...prev, machineRegistrationNumber: e.target.value }))}
                                className="rounded-none border-gray-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Category of Work</Label>
                            <Select
                                value={formData.categoryOfWork}
                                onValueChange={(val) => setFormData(prev => ({ ...prev, categoryOfWork: val }))}
                                required
                            >
                                <SelectTrigger className="rounded-none border-gray-300">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Engine">Engine</SelectItem>
                                    <SelectItem value="Transmission">Transmission</SelectItem>
                                    <SelectItem value="Electrical">Electrical</SelectItem>
                                    <SelectItem value="Hydraulics">Hydraulics</SelectItem>
                                    <SelectItem value="Chassis">Chassis</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>

                {/* Description of Work */}
                <Card className="p-6 rounded-none border-gray-200">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
                                <PenTool className="w-4 h-4 text-[#4e8c31]" />
                                Description of Work Performed
                            </Label>
                            <Textarea
                                className="min-h-[120px] rounded-none border-gray-300 resize-none"
                                placeholder="Details of repairs or services..."
                                value={formData.descriptionOfWorkPerformed}
                                onChange={e => setFormData(prev => ({ ...prev, descriptionOfWorkPerformed: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
                                <ClipboardCheck className="w-4 h-4 text-[#4e8c31]" />
                                Test Performed and Resulted
                            </Label>
                            <Textarea
                                className="min-h-[100px] rounded-none border-gray-300 resize-none"
                                placeholder="Describe tests conducted..."
                                value={formData.testPerformedAndResulted}
                                onChange={e => setFormData(prev => ({ ...prev, testPerformedAndResulted: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Job Completed and Safe to Use?</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, jobCompletedAndSafeToUse: "Yes" }))}
                                    variant={formData.jobCompletedAndSafeToUse === "Yes" ? "default" : "outline"}
                                    className={`rounded-none px-6 ${formData.jobCompletedAndSafeToUse === "Yes" ? "bg-green-600 hover:bg-green-700" : ""}`}
                                >
                                    Yes
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, jobCompletedAndSafeToUse: "No" }))}
                                    variant={formData.jobCompletedAndSafeToUse === "No" ? "default" : "outline"}
                                    className={`rounded-none px-6 ${formData.jobCompletedAndSafeToUse === "No" ? "bg-red-600 hover:bg-red-700" : ""}`}
                                >
                                    No
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Time & Distance Tracking */}
                <Card className="p-6 rounded-none border-gray-200 bg-gray-50">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Time On</Label>
                            <Input type="time" value={formData.timeOn} onChange={e => setFormData(prev => ({ ...prev, timeOn: e.target.value }))} className="rounded-none border-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Time Off</Label>
                            <Input type="time" value={formData.timeOff} onChange={e => setFormData(prev => ({ ...prev, timeOff: e.target.value }))} className="rounded-none border-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Normal Time Hours</Label>
                            <Input type="number" step="0.5" value={formData.normalTimeHours} onChange={e => setFormData(prev => ({ ...prev, normalTimeHours: e.target.value }))} className="rounded-none border-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Over Time Hours</Label>
                            <Input type="number" step="0.5" value={formData.overTimeHours} onChange={e => setFormData(prev => ({ ...prev, overTimeHours: e.target.value }))} className="rounded-none border-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Total Hours</Label>
                            <Input value={formData.totalHours} onChange={e => setFormData(prev => ({ ...prev, totalHours: e.target.value }))} className="rounded-none border-gray-300 font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Normal KM</Label>
                            <Input type="number" value={formData.normalTimeKilometers} onChange={e => setFormData(prev => ({ ...prev, normalTimeKilometers: e.target.value }))} className="rounded-none border-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Over Time KM</Label>
                            <Input type="number" value={formData.overTimeKilometers} onChange={e => setFormData(prev => ({ ...prev, overTimeKilometers: e.target.value }))} className="rounded-none border-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700 uppercase">Total KM</Label>
                            <Input value={formData.totalKilometers} onChange={e => setFormData(prev => ({ ...prev, totalKilometers: e.target.value }))} className="rounded-none border-gray-300 font-bold" />
                        </div>
                    </div>
                </Card>

                {/* Signatures */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-6 rounded-none border-gray-200">
                        <Label className="text-sm font-bold text-gray-700 uppercase mb-4 block">Mechanic Details</Label>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs font-bold text-gray-500">Name & Surname</Label>
                                <Input
                                    required
                                    value={formData.mechanicsName}
                                    onChange={e => setFormData(prev => ({ ...prev, mechanicsName: e.target.value }))}
                                    className="rounded-none border-gray-300 mt-1"
                                />
                            </div>
                            <div className="border-2 border-dashed border-gray-200 p-1 relative group">
                                <Label className="absolute -top-3 left-2 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase">Mechanic Signature</Label>
                                <canvas
                                    ref={mechanicSignRef}
                                    width={400}
                                    height={120}
                                    className="h-32 w-full cursor-crosshair touch-none bg-white"
                                    onMouseDown={(e) => startDrawing(mechanicSignRef.current, setIsDrawingMechanic, e)}
                                    onMouseUp={() => stopDrawing(mechanicSignRef.current, setIsDrawingMechanic, "mechanicsSignature")}
                                    onMouseOut={() => stopDrawing(mechanicSignRef.current, setIsDrawingMechanic, "mechanicsSignature")}
                                    onMouseMove={(e) => drawOne(mechanicSignRef.current, isDrawingMechanic, e)}
                                    onTouchStart={(e) => startDrawing(mechanicSignRef.current, setIsDrawingMechanic, e)}
                                    onTouchEnd={() => stopDrawing(mechanicSignRef.current, setIsDrawingMechanic, "mechanicsSignature")}
                                    onTouchMove={(e) => drawOne(mechanicSignRef.current, isDrawingMechanic, e)}
                                />
                                <div className="flex justify-end p-2 bg-gray-50 border-t">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => clearOneSignature(mechanicSignRef.current, "mechanicsSignature")} className="h-8 text-[10px] font-bold uppercase text-red-600 hover:text-red-700 hover:bg-red-50">
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 rounded-none border-gray-200">
                        <Label className="text-sm font-bold text-gray-700 uppercase mb-4 block">Operator/Driver Details</Label>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-xs font-bold text-gray-500">Name & Surname</Label>
                                <Input
                                    required
                                    value={formData.operatorsName}
                                    onChange={e => setFormData(prev => ({ ...prev, operatorsName: e.target.value }))}
                                    className="rounded-none border-gray-300 mt-1"
                                />
                            </div>
                            <div className="border-2 border-dashed border-gray-200 p-1 relative group">
                                <Label className="absolute -top-3 left-2 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase">Operator Signature</Label>
                                <canvas
                                    ref={operatorSignRef}
                                    width={400}
                                    height={120}
                                    className="h-32 w-full cursor-crosshair touch-none bg-white"
                                    onMouseDown={(e) => startDrawing(operatorSignRef.current, setIsDrawingOperator, e)}
                                    onMouseUp={() => stopDrawing(operatorSignRef.current, setIsDrawingOperator, "operatorsSignature")}
                                    onMouseOut={() => stopDrawing(operatorSignRef.current, setIsDrawingOperator, "operatorsSignature")}
                                    onMouseMove={(e) => drawOne(operatorSignRef.current, isDrawingOperator, e)}
                                    onTouchStart={(e) => startDrawing(operatorSignRef.current, setIsDrawingOperator, e)}
                                    onTouchEnd={() => stopDrawing(operatorSignRef.current, setIsDrawingOperator, "operatorsSignature")}
                                    onTouchMove={(e) => drawOne(operatorSignRef.current, isDrawingOperator, e)}
                                />
                                <div className="flex justify-end p-2 bg-gray-50 border-t">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => clearOneSignature(operatorSignRef.current, "operatorsSignature")} className="h-8 text-[10px] font-bold uppercase text-red-600 hover:text-red-700 hover:bg-red-50">
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Metadata Footer */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border border-gray-300">
                    {[
                        { label: "Document Reference No.", value: "HSEMS / 8.2.1 / REG / 01" },
                        { label: "Author", value: "HSE MANAGER" },
                        { label: "Revision", value: "3" },
                        { label: "Creation Date", value: "20/04/20" },
                    ].map(meta => (
                        <div key={meta.label} className="p-3 border-r border-gray-300 bg-gray-50">
                            <Label className="text-[10px] font-bold text-gray-900 uppercase leading-tight block">{meta.label}</Label>
                            <div className="text-xs text-gray-600 mt-1 font-medium">{meta.value}</div>
                        </div>
                    ))}
                    <div className="p-3 flex flex-col justify-center items-center bg-white">
                        <Label className="text-[10px] font-bold text-gray-900 uppercase leading-tight block">Automatic Number</Label>
                        <div className="text-xl font-black text-gray-900">4512</div>
                    </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-14 w-full md:w-64 bg-[#fbb016] hover:bg-[#e5a014] text-black font-black text-xl rounded-none uppercase tracking-widest shadow-lg"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Job Card"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
