"use client"

import React, { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type CheckStatus } from "@/lib/types"
import { CheckCircle2, Calendar, Skull, AlertTriangle, FileText, Send, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportSubmissionToPDF } from "@/lib/export-utils"

const sections = [
    {
        title: "License and Phepha",
        items: ["Phepha valid.", "Displayed and visible."],
        icon: "phepha-valid.png",
        danger: true
    },
    {
        title: "Protective Structure",
        items: ["No cracks/damages.", "No bolts missing/loose.", "Guards not damaged and intact."],
        icon: "protective-structure.png",
        danger: true
    },
    {
        title: "Exhaust",
        items: ["Clamps secure.", "No excessive smoking/blowing."],
        icon: "exhaust.png",
        danger: true
    },
    {
        title: "Steps and Rails",
        items: ["Steps in good condition.", "Not loose/broken."],
        icon: "steps-and-rails.png",
        danger: false
    },
    {
        title: "Cab",
        items: ["Cab neat and tidy.", "Door and mechanism working.", "Door rubber in good condition.", "Door handles functional."],
        icon: "cabs.png",
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
        title: "Hydraulic Controls",
        items: ["Not loose/responsive.", "No steering play.", "Rear steering.", "Pivot/steering ram pins not loose."],
        icon: "hydraulic-controls.png",
        danger: false
    },
    {
        title: "Safety/Emergency Cut Out System",
        items: ["Fitted.", "Functional."],
        icon: "emergency-cut-out.png",
        danger: true
    },
    {
        title: "Working Lights (LED)",
        items: ["In working order (if LED's, 2 thirds must be working) ie. (If 9 LED's, 6 must be working)."],
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
        title: "Park Brake",
        items: ["In working order.", "No damages."],
        icon: "park-brake.png",
        danger: true
    },
    {
        title: "Battery",
        items: ["Secure.", "Sufficient water.", "Terminals clean/tight & covers on.", "No exposed wiring."],
        icon: "battery.png",
        danger: false
    },
    {
        title: "Radiator",
        items: ["Secure.", "Water level correct.", "No signs of leaking."],
        icon: "radiator.png",
        danger: false
    },
    {
        title: "Fan Belt",
        items: ["No squeaking.", "No signs of damage."],
        icon: "fan-belt.png",
        danger: false
    },
    {
        title: "Wiring",
        items: ["No loose, damaged or exposed wires.", "No loose broken plugs."],
        icon: "wiring.png",
        danger: true
    },
    {
        title: "Oil/Fluid/Air Levels",
        items: ["Check all oil levels/brake fluid levels/clutch fluid levels are correct.", "Check air gauge in order."],
        icon: "fuel-oil-levels.png",
        danger: false
    },
    {
        title: "Fuel & Oil Leaks",
        items: ["Fuel and oil pipes secure.", "No worn or damaged pipes.", "No visible fuel and oil leaks."],
        icon: "fuel-leaks.png",
        danger: false
    },
    {
        title: "Grease",
        items: ["Adequately greased chassis.", "No missing or damaged grease nipples."],
        icon: "grease.png",
        danger: false
    },
    {
        title: "Tyres",
        items: ["No excessive wear and tear.", "No loose/missing/damaged nuts.", "Wheel nuts secure."],
        icon: "excavator-loader-wheels-tyres.png",
        danger: true
    },
    {
        title: "Headboard and Uprights",
        items: ["Uprights secure.", "No cracks."],
        icon: "headboard-uprights.png",
        danger: true
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
        title: "Grab",
        items: ["No leaking/rubbing pipes.", "No loose brackets/bolts/nuts.", "Smooth operation.", "Jaws not cracked."],
        icon: "harvester-head.png",
        danger: false
    },
    {
        title: "All Excess Loose Debris Removed Pre-Shift",
        items: ["Battery are/exhaust area.", "Behind the boom/hydraulic cooler.", "Engine bay."],
        icon: "all-excess-loose-debris.png",
        danger: false
    },
    {
        title: "Visibility Triangle",
        items: ["On the back of the machine.", "Secure.", "Clean and visible."],
        icon: "visibility-triangle.png",
        danger: false
    },
    {
        title: "Communication",
        items: ["Radio or cell phone in working condition.", "Handheld panic alarm functional."],
        icon: "communication.png",
        danger: false
    },
    {
        title: "Dafo Fire Suppression & 1 x 6kg Fire Extinguisher",
        items: ["Gauge light working to confirm power.", "No warning lights showing.", "No damaged hoses.", "Test system on internal panel and fire extinguisher.", "Secured/service/seal in place.", "Gauges in order."],
        icon: "excavator-loader-fire-safety.png",
        danger: true
    },
    {
        title: "Escape Hatch & Hammer",
        items: ["Test the escape hatch opening.", "Escape hammer is easily accessible."],
        icon: "escape-hatch.png",
        danger: true
    }
]

export default function PonsseBisonForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submissionSuccess, setSubmissionSuccess] = useState(false)
    const [submissionData, setSubmissionData] = useState<any>(null)
    const [automaticNumber, setAutomaticNumber] = useState("")

    const [formData, setFormData] = useState({
        operatorName: "",
        shift: "",
        date: new Date().toISOString().split('T')[0],
        hourMeterStart: "",
        hourMeterStop: "",
        validTrainingCard: "", // Date
        unitNumber: "",
        items: {} as Record<string, CheckStatus>,
        areThereAnyDefects: "",
        defectDetails: "",
        signature: "",
        documentRefNo: "HSEMS / 8.1.9 / REG /014", // Need to verify if this is correct reference, using same for now or TBD
        author: "HSE MANAGER",
        revision: "3", // From screenshot
        creationDate: "03/27/20", // From screenshot
        automaticNumber: ""
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

        // Generate Auto Number
        const autoNum = Math.floor(2000 + Math.random() * 9000).toString()
        setAutomaticNumber(autoNum)

        try {
            const hasDefects = formData.areThereAnyDefects === "Yes" || Object.values(formData.items).some(v => v === "def")
            const submission = {
                formType: "ponsse-bison-pre-shift-inspection",
                formTitle: "Ponsse Bison Pre-Shift Inspection Checklist",
                submittedBy: formData.operatorName || "System User",
                submittedAt: new Date().toISOString(),
                hasDefects,
                data: {
                    ...formData,
                    automaticNumber: autoNum,
                    hasDefects
                },
            }

            const response = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submission),
            })

            if (response.status === 401) {
                toast.error("Session expired — please sign in")
                // router.push(`/login?callbackUrl=${pathname}`) // pathname not imported, skipping for now or adding it
                return
            }

            if (response.ok) {
                const result = await response.json()
                setSubmissionData({ ...submission, id: result.id })
                toast.success("Checklist submitted successfully!")
                setSubmissionSuccess(true)
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

    if (submissionSuccess && submissionData) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="rounded-full bg-green-100 p-6">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Submission Successful!</h2>
                    <p className="text-lg text-gray-500">The Ponsse Bison Inspection Checklist has been recorded.</p>
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
        <div className="mx-auto max-w-5xl space-y-10 pb-20 p-6 md:p-10 bg-white shadow-xl rounded-none my-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-gray-100 pb-10">
                <div className="flex flex-col items-center md:items-start gap-4">
                    {/* Increased logo size as per 2nd screenshot */}
                    <div className="relative h-32 w-80">
                        <Image src="/images/ringomode-logo.png" alt="Ringomode Logo" fill className="object-contain" priority />
                    </div>
                </div>
                <div className="text-center md:text-left space-y-2 flex-1 md:pl-10">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#4e8c31] underline decoration-2 underline-offset-8 decoration-[#8cc63f]">
                        HSE Management System
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#4e8c31] underline decoration-2 underline-offset-8 decoration-[#8cc63f]">
                        Ponsse Bison Pre-Shift Inspection Checklist
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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 bg-white p-8 rounded-none shadow-sm border border-gray-100">
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
                        <div className="relative">
                            <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200 pl-10" value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} />
                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        </div>
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
                        <div className="relative">
                            <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200 pl-10" onChange={(e) => setFormData(prev => ({ ...prev, validTrainingCard: e.target.value }))} />
                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Unit Number</Label>
                        <Input className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))} />
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-0 border-t border-gray-200">
                    {sections.map((section, idx) => (
                        <div key={section.title} className="py-10 border-b border-gray-200 hover:bg-gray-50/30 transition-colors">
                            <div className="grid grid-cols-1 lg:grid-cols-[2fr_180px_200px] items-start lg:items-center gap-6 md:gap-10">
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-bold text-gray-900 border-l-4 border-[#4e8c31] pl-4">{section.title}:</h4>
                                    <ul className="ml-8 list-disc text-xl text-gray-600 font-medium">
                                        {section.items.map(it => <li key={it}>{it}</li>)}
                                    </ul>
                                </div>
                                {/* Icons - Resized to 5.5cm x 4cm (approx 208px x 151px) */}
                                <div className="flex justify-center">
                                    <div className="w-[208px] h-[151px] relative p-1 border-2 rounded-none bg-white shadow-md flex items-center justify-center overflow-hidden">
                                        <Image src={`/images/${section.icon}`} alt="" width={200} height={145} className="object-contain w-full h-full" />
                                    </div>
                                </div>
                                {/* Select */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-[#4e8c31] uppercase block">Select</Label>
                                    <Select onValueChange={(v) => handleItemChange(section.title, v as CheckStatus)}>
                                        <SelectTrigger className="h-14 rounded-none border-gray-200 bg-white text-lg">
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
                    <Label className="text-lg font-bold">Details of Defects (If "Def" is selected, please specify defects here)</Label>
                    <Textarea
                        className="min-h-[120px] rounded-none border-gray-200 shadow-inner"
                        onChange={(e) => setFormData(prev => ({ ...prev, defectDetails: e.target.value }))}
                    />
                </div>

                {/* Signature */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between max-w-[378px]">
                        <Label className="text-lg font-bold">Signature</Label>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={clearSignature}>Clear</Button>
                            <Button type="button" variant="outline" size="sm">Undo</Button>
                        </div>
                    </div>
                    {/* Resized to 10cm x 5cm (approx 378px x 189px) */}
                    <div className="rounded-none border-2 border-gray-200 bg-white p-1 inline-block">
                        <canvas
                            ref={canvasRef}
                            width={378}
                            height={189}
                            className="w-[378px] h-[189px] cursor-crosshair touch-none bg-white"
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
                <div className="flex items-center justify-between py-4">
                    <div className="text-sm font-bold text-gray-900">
                        Automatic Number: {formData.automaticNumber || <span className="text-gray-400 italic">Generated on Submit</span>}
                    </div>
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/')}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 font-bold h-12 px-12 rounded-none"
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
