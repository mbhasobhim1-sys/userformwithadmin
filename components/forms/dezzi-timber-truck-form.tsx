"use client"

import React, { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type CheckStatus } from "@/lib/types"
import { CheckCircle2, Send, AlertCircle, Eraser, Info, Skull, AlertTriangle, FileText } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportSubmissionToPDF } from "@/lib/export-utils"

const sections = [
    {
        title: "License and Phepha",
        items: ["Phepha valid.", "Displayed and visible."],
        icon: "license2.png",
        danger: true
    },
    {
        title: "Protective Structure",
        items: ["No cracks/damages.", "No bolts missing/loose.", "Guards not damaged and intact."],
        icon: "protective-structure.png",
        danger: true
    },
    {
        title: "Steps and Rails",
        items: ["Steps in good condition.", "Not loose/broken."],
        icon: "steps-and-rails.png",
        danger: false
    },
    {
        title: "Bonnet Shock Absorbers",
        items: ["In place.", "In good condition."],
        icon: "bonnet-shocks.png",
        danger: false
    },
    {
        title: "Cab",
        items: ["Cab neat and tidy.", "Door and mechanism working.", "Door rubber in good condition.", "Door handles functional."],
        icon: "cabs.png",
        danger: false
    },
    {
        title: "Mirrors",
        items: ["Mirrors in good condition.", "Not damaged.", "Adequately secured – not loose."],
        icon: "mirrors.png",
        danger: false
    },
    {
        title: "Windscreen, Windows & Wipers",
        items: ["Clean/secure.", "No cracks or damages to windscreen.", "Window visibility not obscured by cracks.", "Wipers are working."],
        icon: "wipes.png",
        danger: false
    },
    {
        title: "Air Conditioner",
        items: ["In working condition."],
        icon: "air-conditioner.png",
        danger: false
    },
    {
        title: "Seats",
        items: ["Condition of seat.", "Seat secured.", "Rotating lock functional.", "Seat adjuster functional."],
        icon: "seats.png",
        danger: false
    },
    {
        title: "Safety Belt",
        items: ["Safety belts bolted/secured.", "No damage/not extremely dirty/bleached or dyed.", "Retractor clip in order and clicks into place."],
        icon: "safety-belt.png",
        danger: true
    },
    {
        title: "Steering",
        items: ["Not loose/responsive.", "No steering play – Not > than 15 degrees.", "Power steering in order/no leaks."],
        icon: "excavator-loader-brakes-steering.png",
        danger: false
    },
    {
        title: "Hydraulic Controls",
        items: ["Not loose/responsive.", "No steering play.", "Rear steering.", "Pivot/steering ram pins not loose."],
        icon: "hydraulic-controls.png",
        danger: false
    },
    {
        title: "Hooter and Reverse Alarm",
        items: ["Hooter working and in good condition.", "Reverse alarm working."],
        icon: "hooters.png",
        danger: false
    },
    {
        title: "Gauges",
        items: ["In working order.", "Any warning symbols/lights."],
        icon: "gauges.png",
        danger: false
    },
    {
        title: "Working Lights",
        items: ["Dim/bright working.", "No fused or damaged bulbs.", "Indicators and hazards working.", "Brake light in working order."],
        icon: "led.png",
        danger: true
    },
    {
        title: "Rotating Light",
        items: ["Flashing/rotating beacon light in working condition."],
        icon: "rotating-light.png",
        danger: false
    },
    {
        title: "Braking System (Foot Brake/Exhaust Brake)",
        items: ["Working.", "Retarder working (check lights on dash)."],
        icon: "excavator-loader-brakes-steering.png",
        danger: true
    },
    {
        title: "Emergency Park Brake",
        items: ["Working."],
        icon: "excavator-loader-brakes-steering.png",
        danger: true
    },
    {
        title: "Oil/Fluid/Air Levels",
        items: ["Check all oil levels/brake fluid levels/clutch fluid levels are correct.", "Check air gauge in order."],
        icon: "fuel-oil-levels.png",
        danger: false
    },
    {
        title: "Fuel, Air and Oil leaks",
        items: ["No more than 4 drops of oil per minute."],
        icon: "fuel-leaks.png",
        danger: true
    },
    {
        title: "Grease",
        items: ["Adequately greased chassis.", "No missing or damaged grease nipples."],
        icon: "grease.png",
        danger: false
    },
    {
        title: "Grill",
        items: ["Good condition – no damage.", "Not clogged/air is moving freely."],
        icon: "grill.png",
        danger: false
    },
    {
        title: "Battery",
        items: ["Secure.", "Sufficient water.", "Terminals clean/tight & covers on.", "No exposed wiring."],
        icon: "battery.png",
        danger: false
    },
    {
        title: "Air Pre-Cleaner",
        items: ["Good condition – no damage/no sucking of air.", "Clean and secure.", "No dust in pre-cleaner bowl."],
        icon: "air-pre-cleaner.png",
        danger: false
    },
    {
        title: "V-Belt",
        items: ["Not squeaking.", "No signs of damage.", "Tension in order."],
        icon: "fan-belt.png",
        danger: false
    },
    {
        title: "Radiator",
        items: ["Secure.", "Water level correct.", "No signs of leaking."],
        icon: "radiator.png",
        danger: false
    },
    {
        title: "Air Tank Drain",
        items: ["Good condition.", "Drained daily."],
        icon: "air-tank-drain.png",
        danger: false
    },
    {
        title: "Wiring",
        items: ["No loose, damaged or exposed wires.", "No loose broken plugs."],
        icon: "wiring.png",
        danger: true
    },
    {
        title: "Prop-Shaft/Universals/Carrier Bearings",
        items: ["Check mounting, carrier bearings & universal joints.", "No oil leaks."],
        icon: "prop-shaft.png",
        danger: true
    },
    {
        title: "Drive Train",
        items: ["No oil leaks."],
        icon: "drive-train.png",
        danger: false
    },
    {
        title: "Tyres",
        items: ["Condition of tyres (no cuts/bulges).", "Wheel nuts secure.", "Tyre pressure (visual)."],
        icon: "excavator-loader-wheels-tyres.png",
        danger: true
    },
    {
        title: "Headboard and Uprights",
        items: ["No cracks / loose / missing bolts / missing uprights.", "Tail board secure & pins in place."],
        icon: "headboard-uprights.png",
        danger: true
    },
    {
        title: "Chevron, Reflectors and Tape",
        items: ["Chevron clean & not damaged.", "Reflectors & tape clean and not damaged."],
        icon: "chevron-reflectors.png",
        danger: true
    },
    {
        title: "Visibility Triangle",
        items: ["On the back of the machine.", "Secure.", "Clean and visible."],
        icon: "visibility-triangle.png",
        danger: false
    },
    {
        title: "Boom Structure",
        items: ["Not bent/cracked.", "Pins all secured.", "No loose/missing bolts."],
        icon: "boom-structure.png",
        danger: true
    },
    {
        title: "Hydraulic Cylinders",
        items: ["Good condition – no damage.", "No loose fittings.", "No oil leaks.", "No missing bolts/nuts."],
        icon: "hydraulic-cylinders.png",
        danger: false
    },
    {
        title: "Hydraulic Hoses and Fittings",
        items: ["No excessive rubbing.", "No loose brackets/bolts/nuts.", "Smooth operation.", "Jaws not cracked or broken."],
        icon: "hydraulic-hoses.png",
        danger: false
    },
    {
        title: "Communication",
        items: ["Radio or cell phone in working condition.", "Handheld panic alarm functional."],
        icon: "communication.png",
        danger: false
    },
    {
        title: "Chocks",
        items: ["2 x chocks available.", "In good condition."],
        icon: "chocks.png",
        danger: false
    },
    {
        title: "Fire Extinguisher",
        items: ["Mounted and secured.", "Serviced.", "Gauge in order.", "Seal in place."],
        icon: "fire-system.png",
        danger: true
    },
    {
        title: "Emergency Triangles",
        items: ["2 x available as per legal requirements.", "In good condition."],
        icon: "emergency-triangles.png",
        danger: true
    }
]

export default function DezziTimberTruckForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submissionSuccess, setSubmissionSuccess] = useState(false)
    const [submissionData, setSubmissionData] = useState<any>(null)

    const [formData, setFormData] = useState({
        operatorName: "",
        shift: "",
        date: new Date().toISOString().split('T')[0],
        hourMeterStart: "",
        hourMeterStop: "",
        trainingCardExpiry: "",
        unitNumber: "",
        licensePdpExpiry: "",
        items: {} as Record<string, CheckStatus>,
        brakeEfficiencyTestResult: "",
        areThereAnyDefects: "",
        defectDetails: "",
        signature: "",
        documentRefNo: "HSEMS / 8.1.19 / REG / 01",
        author: "HSE MANAGER",
        revision: "4",
        creationDate: "03/27/2020",
        automaticNumber: ""
    })

    // Generate auto-number once on mount
    const [autoNumber] = useState(() => {
        const date = new Date()
        const yy = date.getFullYear().toString().slice(-2)
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const rand = Math.floor(1000 + Math.random() * 9000)
        return `DT-${yy}${mm}-${rand}`
    })

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)

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
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return
        const rect = canvas.getBoundingClientRect()
        const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left
        const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top
        ctx.beginPath()
        ctx.moveTo(x, y)
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
    }

    const stopDrawing = () => {
        setIsDrawing(false)
        const canvas = canvasRef.current
        if (canvas) {
            setFormData(prev => ({ ...prev, signature: canvas.toDataURL() }))
        }
    }

    const clearSignature = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            setFormData(prev => ({ ...prev, signature: "" }))
        }
    }

    const handleItemChange = (label: string, value: CheckStatus) => {
        setFormData(prev => ({
            ...prev,
            items: { ...prev.items, [label]: value }
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const unanswered = sections.filter(s => !formData.items[s.title])
        if (unanswered.length > 0) {
            toast.error(`Please complete all inspection items. ${unanswered.length} remaining.`)
            return
        }

        if (!formData.signature) {
            toast.error("Please provide a signature.")
            return
        }

        setIsSubmitting(true)

        const submission = {
            id: Math.random().toString(36).substr(2, 9),
            formType: "timber-truck-and-trailer-checklist",
            submittedAt: new Date().toISOString(),
            submittedBy: formData.operatorName || "System User",
            formTitle: "Dezzi Timber Truck Pre-Shift Checklist",
            data: {
                ...formData,
                automaticNumber: autoNumber
            },
            hasDefects: formData.areThereAnyDefects === "Yes" || Object.values(formData.items).some(v => v === "def")
        }

        const existing = JSON.parse(localStorage.getItem("form_submissions") || "[]")
        localStorage.setItem("form_submissions", JSON.stringify([submission, ...existing]))

        setSubmissionData(submission)
        setIsSubmitting(false)
        setSubmissionSuccess(true)
        toast.success("Checklist submitted successfully!")
    }

    if (submissionSuccess && submissionData) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="rounded-full bg-green-100 p-6">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Submission Successful!</h2>
                    <p className="text-lg text-gray-500">The Dezzi Timber Truck Pre-Shift Checklist has been recorded.</p>
                    <p className="text-xl font-bold text-[#4e8c31] mt-2">Automatic Number: {submissionData.data.automaticNumber}</p>
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
        <div className="mx-auto max-w-5xl space-y-10 pb-20 p-6 md:p-10 bg-white shadow-xl rounded-none my-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-gray-100 pb-10">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="relative h-24 w-64">
                        <Image src="/images/ringomode-logo.png" alt="Ringomode Logo" fill className="object-contain" priority />
                    </div>
                </div>
                <div className="text-center md:text-right space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-[#4e8c31] lg:text-3xl underline decoration-2 underline-offset-8 decoration-[#8cc63f] mb-4">
                        HSE Management System
                    </h1>
                    <h2 className="text-xl font-bold text-[#4e8c31] lg:text-2xl italic">
                        Dezzi Timber Truck Pre-Shift Checklist
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 px-4 md:px-0">
                {/* Instructions */}
                <div className="rounded-none border-2 border-[#8cc63f]/20 bg-[#f8faf6] p-8 space-y-4">
                    <h3 className="text-lg font-bold text-[#4e8c31] border-b border-[#8cc63f]/30 pb-2 flex items-center gap-2 text-center md:text-left">
                        General Instructions for Checklist:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-bold text-gray-700">
                        <div className="flex flex-col gap-1 items-center text-center">
                            <p className="underline underline-offset-4 decoration-[#fbb016]">1. Select "Ok" if in order.</p>
                        </div>
                        <div className="flex flex-col gap-1 items-center text-center">
                            <p className="underline underline-offset-4 decoration-[#fbb016]">2. Select "Def" for any defect.</p>
                        </div>
                        <div className="flex flex-col gap-1 items-center text-center">
                            <p className="underline underline-offset-4 decoration-[#fbb016]">3. Select "N/A" if not applicable.</p>
                        </div>
                    </div>
                </div>

                {/* Metadata */}
                <div className="grid gap-6 md:grid-cols-3 bg-white p-8 rounded-none shadow-sm border border-gray-100">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Operators Name & Surname</Label>
                        <Select onValueChange={(v) => setFormData(prev => ({ ...prev, operatorName: v }))}>
                            <SelectTrigger className="h-12 rounded-none bg-gray-50 border-gray-200"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent><SelectItem value="John Doe">John Doe</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Select Shift</Label>
                        <Select onValueChange={(v) => setFormData(prev => ({ ...prev, shift: v }))}>
                            <SelectTrigger className="h-12 rounded-none bg-gray-50 border-gray-200"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent><SelectItem value="Day">Day</SelectItem><SelectItem value="Night">Night</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Date</Label>
                        <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200" value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Hour Meter Start</Label>
                        <Input className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, hourMeterStart: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Hour Meter Stop</Label>
                        <Input className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, hourMeterStop: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Valid Training Card (Exp Date)</Label>
                        <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, trainingCardExpiry: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Unit Number</Label>
                        <Input className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))} />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Valid License & PDP (Exp Date)</Label>
                        <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, licensePdpExpiry: e.target.value }))} />
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-0 border-t border-gray-200">
                    {sections.map((section) => (
                        <div key={section.title} className="py-10 border-b border-gray-200 hover:bg-gray-50/30 transition-colors">
                            <div className="grid grid-cols-1 lg:grid-cols-[2fr_120px_200px] items-start lg:items-center gap-6 md:gap-10">
                                <div className="space-y-2">
                                    <h4 className="text-lg font-bold text-gray-900 border-l-4 border-[#4e8c31] pl-4">{section.title}:</h4>
                                    <ul className="ml-8 list-disc text-sm text-gray-600 font-medium">
                                        {section.items.map(it => <li key={it}>{it}</li>)}
                                    </ul>
                                </div>
                                {/* Icons */}
                                <div className="flex justify-center">
                                    <div className="w-[208px] h-[151px] relative p-1 border rounded-none bg-white shadow-sm flex items-center justify-center">
                                        <Image src={`/images/${section.icon}`} alt="" width={196} height={139} className="object-contain" />
                                    </div>
                                </div>
                                {/* Select */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-[#4e8c31] uppercase block">Select Status</Label>
                                    <Select onValueChange={(v) => handleItemChange(section.title, v as CheckStatus)}>
                                        <SelectTrigger className="h-12 rounded-none border-gray-200 bg-white">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ok">Ok</SelectItem>
                                            <SelectItem value="def">Def</SelectItem>
                                            <SelectItem value="na">N/A</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Brake Efficiency Test */}
                <div className="space-y-6 pt-10 border-t border-gray-200">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-[#fbb016]" />
                        Brake Efficiency Test
                    </h3>
                    <div className="bg-white p-8 rounded-none border-2 border-dashed border-gray-200">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex-1 space-y-4 text-center">
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-4 h-4 rounded-full bg-orange-500" />
                                    <div className="h-0.5 w-40 bg-gray-300 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] font-bold">5m</div>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[10px] border-l-gray-400" />
                                    </div>
                                    <div className="w-4 h-4 rounded-full bg-orange-500" />
                                </div>
                            </div>
                            <div className="w-full md:w-64 space-y-2">
                                <Label className="font-bold text-gray-700">Result</Label>
                                <Input
                                    placeholder="Enter result..."
                                    className="h-12 rounded-none"
                                    onChange={(e) => setFormData(prev => ({ ...prev, brakeEfficiencyTestResult: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Selects/Details */}
                <div className="grid gap-8 md:grid-cols-2 pt-10 border-t border-gray-200">
                    <div className="space-y-2">
                        <Label className="text-lg font-bold">Are There Any Defects Selected</Label>
                        <Select onValueChange={(v) => setFormData(prev => ({ ...prev, areThereAnyDefects: v }))}>
                            <SelectTrigger className="h-12 rounded-none border-gray-200 bg-white"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-lg font-bold">Details of Defects (If "Def" is selected, please specify here)</Label>
                    <Textarea
                        className="min-h-[120px] rounded-none border-gray-200 shadow-inner"
                        onChange={(e) => setFormData(prev => ({ ...prev, defectDetails: e.target.value }))}
                    />
                </div>

                {/* Signature */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-lg font-bold">Signature</Label>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={clearSignature}>Clear</Button>
                            <Button type="button" variant="outline" size="sm">Undo</Button>
                        </div>
                    </div>
                    <div className="rounded-none border-2 border-gray-200 bg-white p-2" style={{ maxWidth: 378 }}>
                        <canvas
                            ref={canvasRef}
                            width={756}
                            height={378}
                            className="cursor-crosshair touch-none block"
                            style={{ width: 378, height: 189 }}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseOut={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                    </div>
                </div>

                {/* Final Metadata Footer */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-gray-200 bg-gray-50/50">
                    {[
                        { label: "Document Reference No.", value: formData.documentRefNo },
                        { label: "Author", value: formData.author },
                        { label: "Revision", value: formData.revision },
                        { label: "Creation Date", value: formData.creationDate },
                    ].map(meta => (
                        <div key={meta.label} className="p-4 border-r border-gray-200 last:border-r-0">
                            <Label className="text-[10px] font-bold text-gray-500 uppercase">{meta.label}</Label>
                            <div className="text-xs font-medium text-gray-900 mt-1">{meta.value}</div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between py-4 border-t border-gray-100 mt-8 pt-8">
                    <div className="text-sm font-bold text-gray-900">
                        Automatic Number: <span className="text-[#4e8c31] font-mono tracking-wider">{autoNumber}</span>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/')}
                            className="h-12 px-8 font-bold rounded-none"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-[#fbb016] hover:bg-[#e5a014] text-black font-extrabold h-12 px-12 rounded-none">
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
