"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckCircle2, AlertTriangle, Info, User, Truck, PenTool, PenLine, ClipboardCheck, FileText } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { exportSubmissionToPDF } from "@/lib/export-utils"
import type { Submission, CheckStatus } from "@/lib/types"

const statusOptions = ["OK", "Def"]

const assessmentSections = [
    {
        letter: "A",
        title: "Engine",
        items: [
            "Condition/Cleanliness",
            "Leaks (Water, Oil or Fuel)",
            "Fluid levels",
            "Starter function",
            "Engine guards",
            "Belts",
            "Radiator hoses and cap"
        ]
    },
    {
        letter: "B",
        title: "Chassis/Frame/Cab",
        items: [
            "Condition and cleanliness",
            "Seats",
            "Doors and locks",
            "Windscreen/windows",
            "Mirrors",
            "Chassis cracks",
            "FOPS / ROPS",
            "Headboards / Uprights",
            "Jockey wheel / load stand (Trailer)",
            "Towbar and eye and tow hook"
        ]
    },
    {
        letter: "C",
        title: "Transmission (Drive Train)",
        items: [
            "Clutch operations and hydraulics",
            "Propshaft, U & CV joints",
            "Diff and final drives (Guards)",
            "Oil leaks",
            "Oscillation",
            "Bogey greasing"
        ]
    },
    {
        letter: "D",
        title: "Electrics",
        items: [
            "Lights",
            "Hooter",
            "Wiper",
            "Battery - secure",
            "Rotating light",
            "Two way radio"
        ]
    },
    {
        letter: "E",
        title: "Brakes",
        items: [
            "Hydraulic leaks/levels",
            "Brake lines/hoses/levers",
            "Exhaust brake",
            "Service brake",
            "Handbrake",
            "Retarder emergency stop",
            "Air pressure gauges"
        ]
    },
    {
        letter: "F",
        title: "Wheels",
        items: [
            "Tyres, rims and spares",
            "Tyre air pressure",
            "Studs and nuts",
            "Tracks/rollers/sprockets",
            "Wheel bearings",
            "Steering - free play"
        ]
    },
    {
        letter: "G",
        title: "Exhaust",
        items: [
            "Leaks",
            "Brackets",
            "Soot"
        ]
    },
    {
        letter: "H",
        title: "Hydraulics",
        items: [
            "No cracks on pipes and fittings",
            "Hydraulic pipes and fittings secure",
            "Hydraulic brackets",
            "Oil leaks",
            "Cylinders",
            "Pins / bushes"
        ]
    },
    {
        letter: "I",
        title: "Safety",
        items: [
            "Safety belt",
            "Reverse alarm",
            "Fire extinguisher / suppression",
            "Chocks x 2",
            "Emergency triangles x 2"
        ]
    },
    {
        letter: "J",
        title: "Attachments (Grab)",
        items: [
            "Hangar link / spacers",
            "Greasing adequate",
            "Rotator",
            "Oil leaks",
            "Cracks / wear",
            "Pins / bushes",
            "Grab tines"
        ]
    },
    {
        letter: "K",
        title: "Attachments (Head)",
        items: [
            "Hangar link / spacers",
            "All grease nipples functional",
            "Rotator",
            "Oil leaks",
            "Cracks / wears",
            "Pins / bushes",
            "Knives and rollers sharp",
            "Rollers / Motors / Bypass",
            "Covers secure"
        ]
    },
    {
        letter: "L",
        title: "Attachments (Winch)",
        items: [
            "Mountings",
            "Greasing adequate",
            "Oil leaks",
            "Condition",
            "Cables and chains",
            "Roller guides"
        ]
    },
    {
        letter: "M",
        title: "Crane / Boom",
        items: [
            "Greasing adequate",
            "Cracks",
            "Pins / Bushes",
            "Nose cone",
            "Main pin"
        ]
    }
]

export default function DailyMachineChecklistForm() {
    const [formData, setFormData] = useState({
        vehicleEquipment: "",
        machineNumber: "",
        date: new Date().toISOString().split("T")[0],
        kilometersHours: "",
        week: "",
        items: {} as Record<string, CheckStatus>,
        hasDefects: "No",
        defectDetails: "",
        managerName: "",
        managerDate: new Date().toISOString().split("T")[0],
        signature: ""
    })

    const [automaticNumber, setAutomaticNumber] = useState("")

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submissionData, setSubmissionData] = useState<Submission | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [history, setHistory] = useState<string[]>([])

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const ctx = canvas.getContext("2d")
            if (ctx) {
                ctx.strokeStyle = "#000"
                ctx.lineWidth = 2
                ctx.lineCap = "round"
            }
        }
    }, [])

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true)
        draw(e)
    }

    const stopDrawing = () => {
        setIsDrawing(false)
        const canvas = canvasRef.current
        if (canvas) {
            const newData = canvas.toDataURL()
            setFormData(prev => ({ ...prev, signature: newData }))
            setHistory(prev => [...prev, newData])
        }
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left
        const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top

        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    const clearSignature = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            setFormData(prev => ({ ...prev, signature: "" }))
            setHistory([])
        }
    }

    const undoSignature = () => {
        if (history.length <= 1) {
            clearSignature()
            return
        }
        const newHistory = history.slice(0, -1)
        setHistory(newHistory)
        const previousState = newHistory[newHistory.length - 1]

        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (canvas && ctx) {
            const img = new window.Image()
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0)
            }
            img.src = previousState
            setFormData(prev => ({ ...prev, signature: previousState }))
        }
    }

    const handleStatusChange = (item: string, status: string) => {
        const checkStatus = status.toLowerCase() === "ok" ? "ok" : "def"
        setFormData(prev => ({
            ...prev,
            items: { ...prev.items, [item]: checkStatus as CheckStatus }
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.signature) {
            toast.error("Please provide a signature before submitting.")
            return
        }


        const autoNum = Math.floor(2000 + Math.random() * 9000).toString()
        setAutomaticNumber(autoNum)

        const submission: Submission = {
            id: Math.random().toString(36).substring(2, 9),
            formType: "daily-machine-checklist",
            formTitle: "Daily Machine Checklist",
            submittedAt: new Date().toISOString(),
            submittedBy: formData.managerName || "Operator",
            data: {
                ...formData,
                hasDefects: formData.hasDefects === "Yes",
                automaticNumber: autoNum
            },
            hasDefects: formData.hasDefects === "Yes"
        }

        const existing = JSON.parse(localStorage.getItem("form_submissions") || "[]")
        localStorage.setItem("form_submissions", JSON.stringify([...existing, submission]))

        setSubmissionData(submission)
        setIsSubmitted(true)
        toast.success("Checklist submitted successfully!")
    }

    if (isSubmitted && submissionData) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="rounded-full bg-green-100 p-6">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Submission Successful!</h2>
                    <p className="text-lg text-gray-500">The Daily Machine Checklist has been recorded.</p>
                    <p className="text-xl font-bold text-[#4e8c31] mt-2">Automatic Number: {automaticNumber}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                        className="bg-[#fbb016] hover:bg-[#e5a014] text-black font-bold gap-2 h-12 px-8"
                        onClick={() => exportSubmissionToPDF(submissionData)}
                    >
                        <FileText className="h-5 w-5" /> Download PDF
                    </Button>
                    <Button variant="outline" className="h-12 px-8 font-bold" onClick={() => window.location.href = "/"}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-5xl space-y-10 pb-20 p-6 md:p-10 bg-white shadow-xl rounded-none my-8">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col items-center justify-between gap-6 border-b border-gray-100 pb-8 md:flex-row">
                    <div className="relative h-24 w-56">
                        <Image src="/images/ringomode-logo.png" alt="Ringomode Logo" fill className="object-contain" priority />
                    </div>
                    <div className="text-center md:text-right">
                        <h1 className="text-2xl font-bold tracking-tight text-[#4e8c31] lg:text-3xl">
                            HSE Management System
                        </h1>
                        <h2 className="text-xl font-bold text-[#4e8c31]">
                            Daily Machine Checklist
                        </h2>
                    </div>
                </div>

                {/* General Instructions */}
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-[#4e8c31] underline">General Instructions for Checklist:</h3>
                    <p className="text-sm text-gray-700 max-w-3xl mx-auto">
                        The mechanic is to conduct a 10 minute physical walkabout of machinery on a daily basis and assess the condition of the attachment.
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                        Outcome to be detailed with an "Ok" if in order and a "Def" if defective. Defective outcomes to be documented below.
                    </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700">Vehicle/Equipment</Label>
                        <Input
                            required
                            value={formData.vehicleEquipment}
                            onChange={e => setFormData(prev => ({ ...prev, vehicleEquipment: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700">Registration/Machine No.</Label>
                        <Input
                            required
                            value={formData.machineNumber}
                            onChange={e => setFormData(prev => ({ ...prev, machineNumber: e.target.value }))}
                        />
                    </div>
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
                        <Label className="text-sm font-bold text-gray-700">Kilometers/Hours</Label>
                        <Input
                            required
                            value={formData.kilometersHours}
                            onChange={e => setFormData(prev => ({ ...prev, kilometersHours: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                        <Label className="text-sm font-bold text-gray-700">Week</Label>
                        <Input
                            required
                            value={formData.week}
                            onChange={e => setFormData(prev => ({ ...prev, week: e.target.value }))}
                        />
                    </div>
                </div>

                {/* Inspection Sections */}
                {assessmentSections.map(section => (
                    <div key={section.title} className="space-y-4 border-t border-gray-200 pt-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-[#4e8c31] underline">
                                {section.letter}. {section.title}
                            </h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {section.items.map((item, idx) => (
                                <div key={item} className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">{idx + 1}. {item}</Label>
                                    <Select onValueChange={value => handleStatusChange(item, value)} required>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map(option => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Defect Selection */}
                <div className="space-y-4 border-t border-gray-200 pt-6">
                    <Label className="text-sm font-bold text-gray-700">Are There Any Defects Selected</Label>
                    <Select
                        value={formData.hasDefects}
                        onValueChange={value => setFormData(prev => ({ ...prev, hasDefects: value }))}
                    >
                        <SelectTrigger className="w-full md:w-64 bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="Yes">Yes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Defects Details */}
                <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700">Details of Defects (If "Def" is selected, please specify defects here)</Label>
                    <Textarea
                        className="min-h-[150px] resize-none border-gray-300"
                        value={formData.defectDetails}
                        onChange={e => setFormData(prev => ({ ...prev, defectDetails: e.target.value }))}
                    />
                </div>

                {/* Professional Footer Sections */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700">Manager's Name</Label>
                        <Input
                            required
                            value={formData.managerName}
                            onChange={e => setFormData(prev => ({ ...prev, managerName: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700">Date</Label>
                        <Input
                            required
                            type="date"
                            value={formData.managerDate}
                            onChange={e => setFormData(prev => ({ ...prev, managerDate: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700">Signature</Label>
                        <Card className="overflow-hidden border-gray-300">
                            <CardContent className="p-0">
                                <canvas
                                    ref={canvasRef}
                                    width={400}
                                    height={150}
                                    className="h-32 w-full cursor-crosshair touch-none bg-white"
                                    onMouseDown={startDrawing}
                                    onMouseUp={stopDrawing}
                                    onMouseOut={stopDrawing}
                                    onMouseMove={draw}
                                    onTouchStart={startDrawing}
                                    onTouchEnd={stopDrawing}
                                    onTouchMove={draw}
                                />
                                <div className="flex justify-end gap-2 border-t bg-gray-50 p-2">
                                    <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
                                        Clear
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={undoSignature}>
                                        Undo
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Footer - document metadata */}
                <div className="flex items-center justify-between py-4 border-t border-gray-100 mt-8 pt-8">
                    <div className="text-sm font-bold text-gray-900">
                        Automatic Number: <span className="text-gray-400 italic">Generated on Submit</span>
                    </div>
                    <div className="flex gap-4">
                        <Button type="button" variant="outline" className="h-12 px-8 font-bold rounded-none" onClick={() => (window.location.href = "/")}>Cancel</Button>
                        <Button type="submit" className="bg-[#fbb016] hover:bg-[#e5a014] text-black font-extrabold h-12 px-12 rounded-none">
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
