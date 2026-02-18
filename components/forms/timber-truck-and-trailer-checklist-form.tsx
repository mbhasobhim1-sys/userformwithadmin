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
import { CheckCircle2, Send, AlertCircle, Eraser, Info, Skull, AlertTriangle, FileText, Calendar } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportSubmissionToPDF } from "@/lib/export-utils"

const sections = [
  {
    title: "License and Phepha",
    items: ["Vehicle license valid.", "PHEPHA valid.", "Displayed and visible.", "Number plates secure."],
    icon: "license2.png",
    danger: true
  },
  {
    title: "Body of Cab / Tank / Trailer",
    items: ["Body work not damaged.", "No new dents or scratches.", "Chassis not cracked.", "Coupling in good condition."],
    icon: "service-truck-body.png",
    danger: false
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
    items: ["Condition of seat.", "Seat secured.", "Safety belt retractor functional."],
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
    items: ["Not loose/responsive.", "No steering play.", "Power steering in order/no leaks."],
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
    title: "Lights & Indicators",
    items: ["Headlights dim/bright.", "Brake lights.", "Indicators and hazards.", "Reflectors and tape in place."],
    icon: "led.png",
    danger: true
  },
  {
    title: "Foot Brake",
    items: ["In working order.", "Check air pressure/fluid levels."],
    icon: "brake-pedal.png",
    danger: true
  },
  {
    title: "Hand Brake",
    items: ["In working order.", "No damage."],
    icon: "hand-brake.png",
    danger: true
  },
  {
    title: "Battery",
    items: ["Secure.", "Terminals clean/tight & covers on.", "No exposed wiring."],
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
    title: "Oil/Fluid Levels",
    items: ["Engine oil level correct.", "Brake/clutch fluid levels correct.", "No visible leaks."],
    icon: "fuel-oil-levels.png",
    danger: false
  },
  {
    title: "Tyres & Rims",
    items: ["No excessive wear and tear.", "No loose/missing/damaged nuts.", "Wheel nuts secure.", "Trailer tyres in good condition."],
    icon: "three-tyres.png",
    danger: true
  },
  {
    title: "Mud Flaps",
    items: ["Available as per legal requirements.", "In good condition."],
    icon: "mud-flaps.png",
    danger: false
  },
  {
    title: "Hazchem Signage",
    items: ["In place and clearly visible.", "Clean and not faded."],
    icon: "hazchem-sign.png",
    danger: true
  },
  {
    title: "Fire Extinguisher",
    items: ["Secured in bracket.", "Seal in place.", "Gauge in order.", "Serviceable date valid."],
    icon: "fire-extinguisher-bottle.png",
    danger: true
  },
  {
    title: "Communication",
    items: ["Radio or cell phone in working condition.", "Panic button functional."],
    icon: "communication.png",
    danger: false
  }
]

export default function TimberTruckAndTrailerChecklistForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [submissionData, setSubmissionData] = useState<any>(null)
  const [automaticNumber, setAutomaticNumber] = useState("")

  const [formData, setFormData] = useState({
    driverName: "",
    unitNumber: "",
    truckReg: "",
    trailerReg: "",
    date: new Date().toISOString().split('T')[0],
    openingKm: "",
    closingKm: "",
    licenseExpiry: "",
    pdpExpiry: "",
    items: {} as Record<string, CheckStatus>,
    areThereAnyDefects: "",
    defectDetails: "",
    signature: "",
    documentRefNo: "HSEMS / 8.1.19 / REG / 015",
    author: "HSE MANAGER",
    revision: "1",
    creationDate: "05/15/24",
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
        formType: "timber-truck-and-trailer-checklist",
        formTitle: "Timber Truck And Trailer Pre-Shift Inspection Checklist",
        submittedBy: formData.driverName || "System User",
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
          <p className="text-lg text-gray-500">The Timber Truck And Trailer Checklist has been recorded.</p>
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
          <div className="relative h-32 w-80">
            <Image src="/images/ringomode-logo.png" alt="Ringomode Logo" fill className="object-contain" priority />
          </div>
        </div>
        <div className="text-center md:text-left space-y-2 flex-1 md:pl-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#4e8c31] underline decoration-2 underline-offset-8 decoration-[#8cc63f]">
            HSE Management System
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-[#4e8c31] underline decoration-2 underline-offset-8 decoration-[#8cc63f]">
            Timber Truck And Trailer Pre-Shift Inspection Checklist
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
            <Label className="text-xs font-bold text-gray-500 uppercase">Driver Name</Label>
            <Input className="h-12 rounded-none bg-gray-50 border-gray-200" required value={formData.driverName} onChange={(e) => setFormData(prev => ({ ...prev, driverName: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase">Unit Number</Label>
            <Input className="h-12 rounded-none bg-gray-50 border-gray-200" required value={formData.unitNumber} onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase">Truck Registration</Label>
            <Input className="h-12 rounded-none bg-gray-50 border-gray-200" required value={formData.truckReg} onChange={(e) => setFormData(prev => ({ ...prev, truckReg: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase">Trailer Registration</Label>
            <Input className="h-12 rounded-none bg-gray-50 border-gray-200" required value={formData.trailerReg} onChange={(e) => setFormData(prev => ({ ...prev, trailerReg: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase">Date</Label>
            <div className="relative">
              <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200 pl-10" value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} />
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase">Opening Kilometres</Label>
            <Input type="number" className="h-12 rounded-none bg-gray-50 border-gray-200" required value={formData.openingKm} onChange={(e) => setFormData(prev => ({ ...prev, openingKm: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase">Closing Kilometres</Label>
            <Input type="number" className="h-12 rounded-none bg-gray-50 border-gray-200" required value={formData.closingKm} onChange={(e) => setFormData(prev => ({ ...prev, closingKm: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase">License Expiry (Exp Date)</Label>
            <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200" required value={formData.licenseExpiry} onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiry: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase">PDP Expiry (Exp Date)</Label>
            <Input type="date" className="h-12 rounded-none bg-gray-50 border-gray-200" required value={formData.pdpExpiry} onChange={(e) => setFormData(prev => ({ ...prev, pdpExpiry: e.target.value }))} />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-0 border-t border-gray-200">
          {sections.map((section, idx) => (
            <div key={section.title} className="py-10 border-b border-gray-200 hover:bg-gray-50/30 transition-colors">
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_120px_208px_200px] items-start lg:items-center gap-6 md:gap-10">
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold text-gray-900 border-l-4 border-[#4e8c31] pl-4">{section.title}:</h4>
                  <ul className="ml-8 list-disc text-xl text-gray-600 font-medium">
                    {section.items.map(it => <li key={it}>{it}</li>)}
                  </ul>
                </div>
                {/* Danger Icons */}
                <div className="flex justify-center">
                  {section.danger ? (
                    <Skull className="h-20 w-20 text-black stroke-1" />
                  ) : (
                    <AlertTriangle className="h-20 w-20 text-black stroke-1" />
                  )}
                </div>
                {/* Icons - Resized to 5.5cm x 4cm */}
                <div className="flex justify-center">
                  <div className="w-[208px] h-[151px] relative p-1 border-2 rounded-none bg-white shadow-md flex items-center justify-center overflow-hidden">
                    <Image src={`/images/${section.icon}`} alt="" width={200} height={145} className="object-contain w-full h-full" />
                  </div>
                </div>
                {/* Select Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#4e8c31] uppercase block">Select Status</Label>
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
            </div>
          </div>
          {/* Resized to 10cm x 5cm */}
          <div className="rounded-none border-2 border-gray-200 bg-white p-1 inline-block">
            <canvas
              ref={canvasRef}
              width={378}
              height={189}
              className="w-[378px] h-[189px] cursor-crosshair touch-none bg-white font-bold"
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
            Automatic Number: {automaticNumber || <span className="text-gray-400 italic font-normal">Generated on Submit</span>}
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
