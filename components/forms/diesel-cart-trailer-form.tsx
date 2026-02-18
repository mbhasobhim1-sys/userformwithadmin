"use client"

import React, { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type CheckStatus } from "@/lib/types"
import { CheckCircle2 } from "lucide-react"
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
        title: "Number Plate",
        items: ["In place and secure.", "Visible (clean and numbering clear)."],
        icon: "license2.png",
        danger: false
    },
    {
        title: "Trailer Body",
        items: ["Frame in good condition (no rust).", "No damage."],
        icon: "protective-structure.png",
        danger: false
    },
    {
        title: "Diesel Tank",
        items: ["In good condition.", "No rusts, dents or leaks.", "Cap on tank in place and seal intact (no rag/paper to be used as a cap)."],
        icon: "fuel-oil-levels.png",
        danger: true
    },
    {
        title: "Hose Pipe & Nozzle",
        items: ["In working order.", "No leaks or cracks."],
        icon: "hydraulic-hoses.png",
        danger: false
    },
    {
        title: "Chevron, Reflectors and Tape",
        items: ["Securely mounted.", "In good condition."],
        icon: "visibility-triangle.png",
        danger: true
    },
    {
        title: "Working Lights",
        items: ["Brake lights, indicators and hazards in working condition.", "No damage."],
        icon: "led.png",
        danger: true
    },
    {
        title: "Trailer Plug & Electric Wiring",
        items: ["Tension in order.", "Good condition and adequately guarded.", "No exposed wiring.", "No joints to cable."],
        icon: "wiring.png",
        danger: true
    },
    {
        title: "Hand Brake/ Brake Cable",
        items: ["In working order.", "No damage."],
        icon: "grease.png",
        danger: true
    },
    {
        title: "Wiring",
        items: ["No loose, damaged or exposed wires.", "No loose broken plugs."],
        icon: "wiring.png",
        danger: true
    },
    {
        title: "Grease",
        items: ["Adequately greased chassis.", "No missing or damaged grease nipples."],
        icon: "grease.png",
        danger: false
    },
    {
        title: "U-Bolts",
        items: ["In good condition.", "Bolts tightened and secure."],
        icon: "grease.png",
        danger: false
    },
    {
        title: "Tyres",
        items: ["Tyres in good condition.", "Air pressure correct.", "Tyres not smooth.", "No damage to the tyres."],
        icon: "battery.png",
        danger: true
    },
    {
        title: "Wheel Rims",
        items: ["In good condition.", "No damage."],
        icon: "radiator.png",
        danger: true
    },
    {
        title: "Wheel Nuts",
        items: ["Wheel nuts all fastened.", "All wheel nuts in place."],
        icon: "gauges.png",
        danger: true
    },
    {
        title: "Mud Flaps",
        items: ["Available as per legal requirements.", "In good condition – not damaged."],
        icon: "protective-structure.png",
        danger: false
    },
    {
        title: "Drawbar",
        items: ["Drawbar and eye in good condition.", "Drawbar bolts in place and secure.", "No metal fatigue."],
        icon: "boom-structure.png",
        danger: true
    },
    {
        title: "Safety Chain",
        items: ["In place.", "Good condition.", "Not damaged and secured."],
        icon: "hydraulic-hoses.png",
        danger: true
    },
    {
        title: "Jockey Wheel",
        items: ["Jockey wheel in good condition.", "No signs of rust.", "Adequately secured to trailer.", "Correct rating (GCM) for the trailer."],
        icon: "fan-belt.png",
        danger: true
    },
    {
        title: "Land Gear, Wooden Stands Not Permitted",
        items: ["In good condition (no rust).", "Adequately secured to trailer.", "Correct rating (GCM) for the trailer."],
        icon: "steps-and-rails.png",
        danger: true
    },
    {
        title: "Hazchem Signage",
        items: ["In place and clearly visible – not faded.", "Clean."],
        icon: "mirrors.png",
        danger: true
    },
    {
        title: "Chocks",
        items: ["2 x chocks available.", "In good condition."],
        icon: "seats.png",
        danger: false
    },
    {
        title: "Emergency Triangles",
        items: ["2 x available as per legal requirements.", "In good condition."],
        icon: "communication.png",
        danger: true
    },
    {
        title: "Fire Extinguisher (1 x 1.5kg extinguisher)",
        items: ["Mounted and secured.", "Serviced.", "Gauge in order.", "Seal in place."],
        icon: "fire-system.png",
        danger: true
    }
]

export default function DieselCartTrailerForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submissionSuccess, setSubmissionSuccess] = useState(false)
    const [submissionData, setSubmissionData] = useState<any>(null)

    const [formData, setFormData] = useState({
        userName: "",
        registrationNumber: "",
        date: new Date().toISOString().split('T')[0],
        items: {} as Record<string, CheckStatus>,
        areThereAnyDefects: "",
        defectDetails: "",
        signature: "",
        documentRefNo: "HSEMS / 8.1.9 / REG /014",
        author: "HSE MANAGER",
        revision: "2",
        creationDate: "03/27/20",
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
        // Example: Random 4-digit number or timestamp based. 
        // In a real app, this might come from the backend.
        const autoNumber = Math.floor(2000 + Math.random() * 9000).toString();
        const finalData = { ...formData, automaticNumber: autoNumber };

        setTimeout(() => {
            const submission = {
                id: Math.random().toString(36).substr(2, 9),
                formType: "diesel-cart-trailer-inspection-checklist",
                submittedAt: new Date().toISOString(),
                submittedBy: formData.userName || "System User",
                formTitle: "Diesel Cart Trailer Inspection Checklist",
                data: finalData,
                hasDefects: formData.areThereAnyDefects === "Yes" || Object.values(formData.items).some(v => v === "def")
            }

            const existing = JSON.parse(localStorage.getItem("form_submissions") || "[]")
            localStorage.setItem("form_submissions", JSON.stringify([submission, ...existing]))

            setSubmissionData(submission)
            setIsSubmitting(false)
            setSubmissionSuccess(true)
            toast.success(`Submitted! Auto Number: ${autoNumber}`)
        }, 1500)
    }

    if (submissionSuccess && submissionData) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="rounded-full bg-green-100 p-6">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Submission Successful!</h2>
                    <p className="text-lg text-gray-500">The Diesel Cart Trailer Inspection Checklist has been recorded.</p>
                    <p className="text-xl font-bold text-[#4e8c31] mt-2">Automatic Number: {submissionData.data.automaticNumber}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                        className="bg-[#fbb016] hover:bg-[#e5a014] text-black font-bold gap-2 h-12 px-8"
                        onClick={() => exportSubmissionToPDF(submissionData)}
                    >
                        Download PDF
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
                    {/* Increased logo size */}
                    <div className="relative h-32 w-80">
                        <Image src="/images/ringomode-logo.png" alt="Ringomode Logo" fill className="object-contain" priority />
                    </div>
                </div>
                <div className="text-center md:text-left space-y-2 flex-1 md:pl-10">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#4e8c31] underline decoration-2 underline-offset-8 decoration-[#8cc63f]">
                        HSE Management System
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#4e8c31] underline decoration-2 underline-offset-8 decoration-[#8cc63f]">
                        Diesel Cart Trailer Inspection Checklist
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
                        <Label className="text-xs font-bold text-gray-500 uppercase">User's Name</Label>
                        <Select onValueChange={(v) => setFormData(prev => ({ ...prev, userName: v }))}>
                            <SelectTrigger className="h-12 rounded-none bg-gray-50 border-gray-200"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent><SelectItem value="John Doe">John Doe</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Registration Number</Label>
                        <Input className="h-12 rounded-none bg-gray-50 border-gray-200" onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Date</Label>
                        <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200" value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} />
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
                                {/* Icons */}
                                <div className="flex justify-center">
                                    <div className="w-[208px] h-[151px] relative p-2 border-2 rounded-none bg-white shadow-md flex items-center justify-center">
                                        <Image src={`/images/${section.icon}`} alt="" width={180} height={130} className="object-contain" />
                                    </div>
                                </div>
                                {/* Select */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-[#4e8c31] uppercase block">Select{idx + 1}</Label>
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
                    <div className="flex items-center justify-between">
                        <Label className="text-lg font-bold">Signature</Label>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={clearSignature}>Clear</Button>
                            <Button type="button" variant="outline" size="sm">Undo</Button>
                        </div>
                    </div>
                    <div className="rounded-none border-2 border-gray-200 bg-white p-2">
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={378}
                            className="w-full h-[378px] cursor-crosshair touch-none"
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
