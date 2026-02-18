"use client"

import React, { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type CheckStatus } from "@/lib/types"
import { CheckCircle2, AlertTriangle, FileText } from "lucide-react"
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
        title: "Body of Cab/Trailer",
        items: ["Condition of body.", "No damage/rust."],
        icon: "trailer-body.png",
        danger: true
    },
    {
        title: "Exhaust",
        items: ["Secure.", "No leaks."],
        icon: "exhaust.png",
        danger: false
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
        title: "Steering Column",
        items: ["Not loose/responsive.", "No steering play – Not > than 15 degrees.", "Power steering in order/no leaks."],
        icon: "excavator-loader-brakes-steering.png",
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
        title: "Clutch",
        items: ["Clutch taking correctly – not slipping.", "In working order."],
        icon: "clutch_pedal.png",
        danger: true
    },
    {
        title: "Lamps",
        items: ["Dim/bright working.", "No fused or damaged bulbs.", "Indicators and hazards working.", "Brake light in working order."],
        icon: "led.png",
        danger: true
    },
    {
        title: "Brakes",
        items: ["In working order.", "Sufficient air build up."],
        icon: "brakes_pedal.png",
        danger: true
    },
    {
        title: "Handbrake/ Brake Cable",
        items: ["Working."],
        icon: "brakes_pedal.png",
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
        title: "Air Tank Drain",
        items: ["Good condition.", "Drained daily."],
        icon: "air-tank-drain.png",
        danger: false
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
        title: "Differentials",
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
        title: "Mud Flaps",
        items: ["Secure.", "In good condition."],
        icon: "trailer-mud-flaps.png",
        danger: false
    },
    {
        title: "Hoses & Fittings (Air & Hydraulics)",
        items: ["No leaks.", "Not loose or damaged."],
        icon: "hydraulic-hoses.png",
        danger: true
    },
    {
        title: "Hydraulic Controls",
        items: ["Working order."],
        icon: "hydraulic-controls.png",
        danger: false
    },
    {
        title: "Trailer Deck",
        items: ["Ensure trailer deck/floor is in good condition.", "Not rusted."],
        icon: "trailer_deck.png",
        danger: true
    },
    {
        title: "Tow Bar & Hitch/King Pin",
        items: ["Secure.", "No damage."],
        icon: "trailer-drawbar.png",
        danger: true
    },
    {
        title: "Landing Gear",
        items: ["Working order."],
        icon: "trailer-land-gear.png",
        danger: false
    },
    {
        title: "Anchor Points, Chains & Binders",
        items: ["Ensure anchor points are safe enough to use.", "Chains and binders to be used are in good condition."],
        icon: "trailer-safety-chain.png",
        danger: true
    },
    {
        title: "Chevron, Reflectors and Tape",
        items: ["Chevron clean & not damaged.", "Reflectors & tape clean and not damaged."],
        icon: "chevron-reflectors.png",
        danger: true
    },
    {
        title: "Slow Moving Vehicle Signage",
        items: ["Visible.", "In good condition."],
        icon: "visibility-triangle.png",
        danger: false
    },
    {
        title: "Chocks",
        items: ["2 x chocks available.", "In good condition."],
        icon: "chocks.png",
        danger: false
    },
    {
        title: "Emergency Triangles",
        items: ["2 x available as per legal requirements.", "In good condition."],
        icon: "emergency-triangles.png",
        danger: true
    },
    {
        title: "Fire Extinguisher",
        items: ["Mounted and secured.", "Serviced.", "Gauge in order.", "Seal in place."],
        icon: "fire-system.png",
        danger: true
    }
]

export default function LowbedStepDeckForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submissionSuccess, setSubmissionSuccess] = useState(false)
    const [submissionData, setSubmissionData] = useState<any>(null)

    const [automaticNumber, setAutomaticNumber] = useState("")

    const [formData, setFormData] = useState({
        driversName: "",
        truckRegistrationNumber: "",
        date: new Date().toISOString().split('T')[0],
        odometerStart: "",
        hourMeterStart: "",
        validTrainingCard: "",
        validPdpLicense: "",
        dangerousGoodsTrainingCard: "",
        items: {} as Record<string, CheckStatus>,
        hasDefects: "",
        defectDetails: "",
        signature: "",
        documentRefNo: "HSEMS / 8.1.19 / REG / 025",
        author: "HSE MANAGER",
        revision: "2",
        creationDate: "04/10/2026",
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

        // Generate Auto Number on submission
        const date = new Date()
        const yy = date.getFullYear().toString().slice(-2)
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const rand = Math.floor(1000 + Math.random() * 9000)
        const autoNum = `LSD-${yy}${mm}-${rand}`
        setAutomaticNumber(autoNum)

        const submission = {
            id: Math.random().toString(36).substr(2, 9),
            formType: "lowbed-step-deck",
            submittedAt: new Date().toISOString(),
            submittedBy: formData.driversName || "System User",
            formTitle: "Lowbed And Step Deck Trailer Pre-Use Checklist",
            data: {
                ...formData,
                automaticNumber: autoNum
            },
            hasDefects: formData.hasDefects === "Yes" || Object.values(formData.items).some(v => v === "def")
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
                    <p className="text-lg text-gray-500">The Lowbed And Step Deck Trailer Pre-Use Checklist has been recorded.</p>
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
                    <div className="relative h-24 w-64">
                        <Image src="/images/ringomode-logo.png" alt="Ringomode Logo" fill className="object-contain" priority />
                    </div>
                </div>
                <div className="text-center md:text-right space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-[#4e8c31] lg:text-3xl underline decoration-2 underline-offset-8 decoration-[#8cc63f] mb-4">
                        HSE Management System
                    </h1>
                    <h2 className="text-xl font-bold text-[#4e8c31] lg:text-2xl italic">
                        Lowbed And Step Deck Trailer Pre-Use Checklist
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 px-4 md:px-0">
                {/* Instructions */}
                <div className="rounded-none border-2 border-[#8cc63f]/20 bg-[#f8faf6] p-8 space-y-4">
                    <h3 className="text-lg font-bold text-[#4e8c31] border-b border-[#8cc63f]/30 pb-2 flex items-center gap-2">
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
                        <Label className="text-xs font-bold text-gray-500 uppercase">Drivers Name & Surname</Label>
                        <Select onValueChange={(v) => setFormData(prev => ({ ...prev, driversName: v }))}>
                            <SelectTrigger className="h-12 rounded-none bg-gray-50 border-gray-200"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="John Smith">John Smith</SelectItem>
                                <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Truck Registration Number</Label>
                        <Input className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, truckRegistrationNumber: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Date</Label>
                        <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200" value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Odometer Start</Label>
                        <Input className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, odometerStart: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Hour Meter Start</Label>
                        <Input className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, hourMeterStart: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Valid Training Card (Exp Date)</Label>
                        <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, validTrainingCard: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Valid PDP License (Exp Date)</Label>
                        <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, validPdpLicense: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Dangerous Goods Card (Exp Date)</Label>
                        <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, dangerousGoodsTrainingCard: e.target.value }))} />
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-0 border-t border-gray-200">
                    {sections.map((section) => (
                        <div key={section.title} className="py-10 border-b border-gray-200 hover:bg-gray-50/30 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-[2fr_210px_180px] gap-8 items-start">
                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                        {section.title}
                                        {section.danger && (
                                            <span className="bg-red-100 p-1 rounded-full">
                                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                            </span>
                                        )}
                                    </h4>
                                    <ul className="space-y-2">
                                        {section.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#8cc63f] shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex justify-center">
                                    <div className="relative w-[208px] h-[151px] border border-gray-100 rounded-none bg-white p-1 shadow-sm">
                                        <Image
                                            src={`/images/${section.icon}`}
                                            alt={section.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                                {/* Select Status */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-[#4e8c31] uppercase block text-center lg:text-left">Select Status</Label>
                                    <Select onValueChange={(v) => handleItemChange(section.title, v as CheckStatus)}>
                                        <SelectTrigger className="h-14 rounded-none border-gray-200 bg-white text-base">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ok" className="text-base">Ok</SelectItem>
                                            <SelectItem value="def" className="text-base">Def</SelectItem>
                                            <SelectItem value="na" className="text-base">N/A</SelectItem>
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
                        <Select onValueChange={(v) => setFormData(prev => ({ ...prev, hasDefects: v }))}>
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

                {/* Signature — 10cm × 5cm at 96dpi ≈ 378px × 189px */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-xl font-bold">Signature</Label>
                        <Button type="button" variant="outline" size="sm" onClick={clearSignature}>Clear</Button>
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
                    <div className="text-base font-bold text-gray-900">
                        Automatic Number: <span className="text-gray-400 italic">Generated on Submit</span>
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
