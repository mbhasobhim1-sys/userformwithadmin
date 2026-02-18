"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowLeft, CheckCircle2, FileText, Skull } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import SignatureCanvas from "react-signature-canvas"
import { waterCartTrailerItems, type FormType, type CheckStatus } from "@/lib/types"
import { exportSubmissionToPDF } from "@/lib/export-utils"

// --- Icons Map ---
const iconMap: Record<string, string> = {
    "License and Phepha": "license2.png",
    "Number Plate": "trailer-number-plate.png",
    "Trailer Body": "trailer-body.png",
    "Water Tank": "trailer-body.png",
    "Hose Pipe & Nozzle": "hydraulic-hoses.png",
    "Chevron, Reflectors and Tape": "chevron-reflectors.png",
    "Working Lights": "led.png",
    "Trailer Plug & Electric Wiring": "wiring.png",
    "U-Bolts": "trailer-u-bolts.png",
    "Straps & Ratchets": "trailer-body.png",
    "Safety Chain": "trailer-safety-chain.png",
    "Tyres": "excavator-loader-wheels-tyres.png",
    "Wheel Rims": "excavator-loader-wheels-tyres.png",
    "Wheel Nuts": "excavator-loader-wheels-tyres.png",
    "Mud Flaps": "trailer-mud-flaps.png",
    "Drawbar": "trailer-drawbar.png",
    "Jockey Wheel": "trailer-jockey-wheel.png",
    "Land Gear, Wooden Stands Not Permitted": "trailer-land-gear.png",
    "Signage": "communication.png",
    "Chocks": "chocks.png",
    "Emergency Triangles": "emergency-triangles.png",
    "Fire Extinguishers (One in place)": "excavator-loader-fire-safety.png",
}

// --- Item Descriptions ---
const itemDescriptions: Record<string, string[]> = {
    "License and Phepha": ["Check if valid and displayed"],
    "Number Plate": ["Secure and visible"],
    "Trailer Body": ["Check for cracks, corrosion or damage"],
    "Water Tank": ["Secure, no leaks"],
    "Hose Pipe & Nozzle": ["Condition and operation"],
    "Chevron, Reflectors and Tape": ["Clean and visible"],
    "Working Lights": ["Test all lights"],
    "Trailer Plug & Electric Wiring": ["Check pins and insulation"],
    "U-Bolts": ["Tight and secure"],
    "Straps & Ratchets": ["Condition and operation"],
    "Safety Chain": ["Secure and undamaged"],
    "Tyres": ["Tread depth and pressure"],
    "Wheel Rims": ["No cracks or damage"],
    "Wheel Nuts": ["All present and tight"],
    "Mud Flaps": ["Secure and functional"],
    "Drawbar": ["No cracks or damage"],
    "Jockey Wheel": ["Operation and condition"],
    "Land Gear, Wooden Stands Not Permitted": ["Stands functional and secure"],
    "Signage": ["Correct signage displayed"],
    "Chocks": ["Check if available"],
    "Emergency Triangles": ["Check if available"],
    "Fire Extinguishers (One in place)": ["Check if serviced and sealed"],
}

const dangerItems = {
    skull: [
        "License and Phepha",
        "Hose Pipe & Nozzle",
        "Chevron, Reflectors and Tape",
        "Working Lights",
        "Trailer Plug & Electric Wiring",
        "Straps & Ratchets",
        "Safety Chain",
        "Tyres",
        "Wheel Rims",
        "Wheel Nuts",
        "Drawbar",
        "Jockey Wheel",
        "Land Gear, Wooden Stands Not Permitted",
        "Signage",
        "Emergency Triangles",
        "Fire Extinguishers (One in place)",
    ],
    warning: [
        "Number Plate",
        "Trailer Body",
        "Water Tank",
        "U-Bolts",
        "Mud Flaps",
        "Chocks",
    ]
}

export default function WaterCartTrailerInspectionForm() {
    const sigPad = useRef<any>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [automaticNumber, setAutomaticNumber] = useState("")

    const [formData, setFormData] = useState({
        userName: "",
        registrationNumber: "",
        date: "",
        documentRefNo: "HSEMS / 8.1.19 / REG / 015A",
        author: "HSE MANAGER",
        revision: "3",
        creationDate: "04/10/24"
    })

    const [items, setItems] = useState<Record<string, CheckStatus>>(
        Object.fromEntries(waterCartTrailerItems.map((item) => [item, null]))
    )
    const [defectDetails, setDefectDetails] = useState("")

    useEffect(() => {
        setMounted(true)
        const date = new Date()
        const dateStr = date.toISOString().split("T")[0]
        setFormData(prev => ({ ...prev, date: dateStr }))
        setAutomaticNumber(Math.floor(1000 + Math.random() * 9000).toString())
    }, [])

    const handleStatusChange = (item: string, status: CheckStatus) => {
        setItems((prev) => ({ ...prev, [item]: status }))
    }

    const clearSignature = () => sigPad.current?.clear()
    const undoSignature = () => {
        const data = sigPad.current?.toData()
        if (data) {
            data.pop()
            sigPad.current?.fromData(data)
        }
    }

    const hasDefects = Object.values(items).some((s) => s === "def")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.userName || !formData.registrationNumber) {
            toast.error("Please fill in all required fields")
            return
        }

        const unanswered = waterCartTrailerItems.filter(item => items[item] === null)
        if (unanswered.length > 0) {
            toast.error(`Please complete all items. ${unanswered.length} remaining.`)
            return
        }

        if (sigPad.current?.isEmpty()) {
            toast.error("Please provide a signature")
            return
        }

        setIsSubmitting(true)
        try {
            const submission = {
                formType: "water-cart-trailer-inspection" as FormType,
                formTitle: "Water Cart Trailer Inspection Checklist",
                submittedBy: formData.userName,
                submittedAt: new Date().toISOString(),
                hasDefects,
                data: {
                    ...formData,
                    items,
                    defectDetails,
                    signature: sigPad.current?.toDataURL(),
                    automaticNumber
                },
            }

            const response = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submission),
            })

            if (!response.ok) throw new Error("Failed to submit")

            const result = await response.json()

            // Trigger PDF Download
            exportSubmissionToPDF({
                ...submission,
                id: result.id || `WCT-${automaticNumber}`,
            })

            toast.success("Checklist submitted successfully!")
            setIsSuccess(true)
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 p-4 rounded-full">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Submission Successful!</h2>
                    <p className="text-slate-600 mb-8">
                        The Water Cart Trailer inspection has been recorded.
                    </p>
                    <div className="space-y-3">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                            <Link href="/">Return to Home</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild className="hover:bg-slate-200">
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                        </Link>
                    </Button>
                </div>

                <Card className="p-10 bg-white border-none shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-shrink-0">
                            <Image src="/images/ringomode-logo.png" alt="Ringomode Logo" width={220} height={75} className="object-contain" />
                        </div>
                        <div className="text-center flex-1">
                            <h1 className="text-3xl font-bold text-green-700 leading-tight">HSE Management System</h1>
                            <h2 className="text-3xl font-bold text-green-600 underline decoration-green-200 underline-offset-8 mt-4 max-w-xl mx-auto">
                                Water Cart Trailer Inspection Checklist
                            </h2>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Users Name</Label>
                        <Input value={formData.userName} onChange={(e) => setFormData({ ...formData, userName: e.target.value })} required />
                    </div>
                    <div>
                        <Label>Registration Number</Label>
                        <Input value={formData.registrationNumber} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} required />
                    </div>
                    <div>
                        <Label>Date</Label>
                        <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                    </div>
                </div>

                <div className="space-y-4">
                    {waterCartTrailerItems.map((item) => {
                        const isSkull = dangerItems.skull.includes(item)
                        const isWarning = dangerItems.warning.includes(item)
                        const descriptions = itemDescriptions[item] || []
                        const iconFile = iconMap[item]

                        return (
                            <Card key={item} className="p-4 overflow-hidden bg-white border-slate-200 shadow-sm">
                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-base text-slate-900">{item}:</h4>
                                        </div>
                                        <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                                            {descriptions.map((desc, i) => (
                                                <li key={i}>{desc}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        {isSkull && <Skull className="h-10 w-10 text-slate-800" strokeWidth={1.5} />}

                                        {iconFile && (
                                            <div className="w-[210px] h-[155px] relative flex items-center justify-center bg-white border border-slate-100 p-1">
                                                <Image
                                                    src={`/images/${iconFile}`}
                                                    alt={item}
                                                    width={180}
                                                    height={130}
                                                    className="object-contain max-h-full max-w-full"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-shrink-0 min-w-[140px]">
                                        <Select value={items[item] || ""} onValueChange={(val) => handleStatusChange(item, val as CheckStatus)}>
                                            <SelectTrigger className={
                                                items[item] === 'ok' ? "bg-green-50 border-green-200 text-green-700" :
                                                    items[item] === 'def' ? "bg-red-50 border-red-200 text-red-700" :
                                                        items[item] === 'na' ? "bg-slate-50 text-slate-600" : ""
                                            }>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ok">Ok</SelectItem>
                                                <SelectItem value="def">Defect</SelectItem>
                                                <SelectItem value="na">N/A</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>

                {/* USER REQUESTED FOOTER */}
                <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-6">
                    <div>
                        <Label className="text-sm font-bold text-slate-900">Are There Any Defects Selected</Label>
                        <Select disabled value={hasDefects ? "yes" : "no"}>
                            <SelectTrigger className="mt-1 bg-slate-50">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-slate-900">Details of Defects (If "Def" is selected, please specify defects here)</Label>
                        <Textarea
                            value={defectDetails}
                            onChange={(e) => setDefectDetails(e.target.value)}
                            className="mt-1 h-32"
                            placeholder="Specify defects here..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <Label className="text-sm font-bold text-slate-900 mb-2 block">Signature</Label>
                            <div className="border border-slate-200 rounded-sm bg-white w-full max-w-[378px]">
                                <SignatureCanvas
                                    ref={sigPad}
                                    canvasProps={{
                                        className: "signature-canvas",
                                        style: { width: '378px', height: '189px' }
                                    }}
                                />
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Button type="button" variant="outline" size="sm" onClick={clearSignature} className="rounded-none border-slate-300">Clear</Button>
                                <Button type="button" variant="outline" size="sm" onClick={undoSignature} className="rounded-none border-slate-300">Undo</Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end pt-4">
                        <div className="col-span-1 md:col-span-1">
                            <Label className="text-[11px] font-bold text-slate-600 uppercase">Document Reference No.</Label>
                            <Input value={formData.documentRefNo} readOnly className="h-10 bg-slate-50 text-slate-400 border-slate-200 rounded-none mt-1" />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <Label className="text-[11px] font-bold text-slate-600 uppercase">Author</Label>
                            <Input value={formData.author} readOnly className="h-10 bg-slate-50 text-slate-400 border-slate-200 rounded-none mt-1" />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <Label className="text-[11px] font-bold text-slate-600 uppercase">Revision</Label>
                            <Input value={formData.revision} readOnly className="h-10 bg-slate-50 text-slate-400 border-slate-200 rounded-none mt-1 text-center" />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <Label className="text-[11px] font-bold text-slate-600 uppercase">Creation Date</Label>
                            <div className="relative">
                                <Input value={formData.creationDate} readOnly className="h-10 bg-slate-50 text-slate-400 border-slate-200 rounded-none mt-1" />
                                <FileText className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-1 pb-2">
                            <div className="text-sm font-bold text-slate-900">
                                Automatic Number
                            </div>
                            <div className="text-sm text-slate-500 font-medium">
                                {automaticNumber}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button type="submit" disabled={isSubmitting} className="bg-[#fbb016] hover:bg-[#e5a014] text-black font-extrabold h-12 px-12 rounded-none">
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    )
}
