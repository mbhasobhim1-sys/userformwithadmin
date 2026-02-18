"use client"

import React, { useRef, useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChecklistRadioGroup } from "@/components/checklist-radio-group"
import { ChecklistStatusBadge } from "@/components/checklist-status-badge"
import { excavatorLoaderItems, type CheckStatus } from "@/lib/types"
import { AlertTriangle, CheckCircle2, Send, ArrowLeft, AlertCircle, Eraser, FileText, Skull, Triangle } from "lucide-react"
import { exportSubmissionToPDF } from "@/lib/export-utils"
import Link from "next/link"
import Image from "next/image"

// ---- SECTION DEFINITIONS for Excavator Loader (grouped logically) ----
// ---- SECTION DEFINITIONS for Excavator Loader (Detailed breakdown from screenshots) ----
const sections = [
  {
    title: "License and Phepha",
    type: "critical",
    image: "license2.png",
    items: [
      "Phepha valid.",
      "Displayed and visible."
    ]
  },
  {
    title: "Protective Structure",
    type: "critical",
    image: "protective-structure.png",
    items: [
      "No cracks/damages.",
      "No bolts missing/loose.",
      "Guards not damaged and intact."
    ]
  },
  {
    title: "Exhaust",
    type: "critical",
    image: "exhaust.png",
    items: [
      "Clamps secure.",
      "No excessive smoking/blowing."
    ]
  },
  {
    title: "Steps and Rails",
    type: "warning",
    image: "steps-and-rails.png",
    items: [
      "Steps in good condition.",
      "Not loose/broken."
    ]
  },
  {
    title: "Cab",
    type: "warning",
    image: "cabs.png",
    items: [
      "Cab neat and tidy.",
      "Door and mechanism working.",
      "Door rubber in good condition.",
      "Door handles functional."
    ]
  },
  {
    title: "Windscreen, Windows & Wipers",
    type: "warning",
    image: "wipes.png",
    items: [
      "Clean/secure.",
      "No cracks or damages to windscreen.",
      "Window visibility not obscured by cracks.",
      "Wipers are working."
    ]
  },
  {
    title: "Air Conditioner",
    type: "warning",
    image: "air-conditioner.png",
    items: [
      "In working condition."
    ]
  },
  {
    title: "Seats",
    type: "warning",
    image: "seats.png",
    items: [
      "Condition of seat.",
      "Seat secured.",
      "Rotating lock functional.",
      "Seat adjuster functional."
    ]
  },
  {
    title: "Safety Belt",
    type: "critical",
    image: "safety-belt.png",
    items: [
      "Safety belts bolted/secured.",
      "No damage/not extremely dirty/bleached or dyed.",
      "Retractor clip in order and clicks into place."
    ]
  },
  {
    title: "Hooter and Reverse Alarm",
    type: "warning",
    image: "hooters.png",
    items: [
      "Hooter working and in good condition.",
      "Reverse alarm working."
    ]
  },
  {
    title: "Gauges",
    type: "warning",
    image: "gauges.png",
    items: [
      "In working order.",
      "Any warning symbols/lights."
    ]
  },
  {
    title: "Hydraulic Controls",
    type: "warning",
    image: "hydraulic-controls.png",
    items: [
      "Not loose/responsive.",
      "No steering play.",
      "Rear steering.",
      "Pivot/steering ram pins not loose."
    ]
  },
  {
    title: "Hydraulic Head Cut Off (Bail Lever)",
    type: "critical",
    image: "bail-lever.png",
    items: [
      "Operational (when it is disengaged, the hydraulics do not operate)."
    ]
  },
  {
    title: "Working Lights (LED)",
    type: "critical",
    image: "led.png",
    items: [
      "In working order (if LED's, 2 thirds must be working) ie. (If 9 LED's, 6 must be working)."
    ]
  },
  {
    title: "Rotating Light",
    type: "warning",
    image: "rotating-light.png",
    items: [
      "Flashing/rotating beacon light in working condition."
    ]
  },
  {
    title: "Grill (Sieve)",
    type: "warning",
    image: "grill.png",
    items: [
      "Check condition – no damage.",
      "Not clogged.",
      "Air is moving freely."
    ]
  },
  {
    title: "Battery",
    type: "warning",
    image: "battery.png",
    items: [
      "Secure.",
      "Sufficient water.",
      "Terminals clean/tight & covers on.",
      "No exposed wiring."
    ]
  },
  {
    title: "Radiator",
    type: "warning",
    image: "radiator.png",
    items: [
      "Secure.",
      "Water level correct.",
      "No signs of leaking."
    ]
  },
  {
    title: "Air Pre-Cleaner",
    type: "warning",
    image: "air-pre-cleaner.png",
    items: [
      "Good condition – no damage/no sucking of air.",
      "Clean and secure.",
      "No dust in pre-cleaner bowl."
    ]
  },
  {
    title: "Fan Belt",
    type: "warning",
    image: "fan-belt.png",
    items: [
      "No squeaking.",
      "No signs of damage."
    ]
  },
  {
    title: "Fuel & Oil levels",
    type: "warning",
    image: "fuel-oil-levels.png",
    items: [
      "Fuel and oil levels correct.",
      "Fuel cap and hydraulic filler cap secure.",
      "All dipsticks secure."
    ]
  },
  {
    title: "Fuel & Oil Leaks",
    type: "warning",
    image: "fuel-leaks.png",
    items: [
      "Fuel and oil pipes secure.",
      "No worn or damaged pipes.",
      "No visible fuel and oil leaks."
    ]
  },
  {
    title: "Wiring",
    type: "critical",
    image: "wiring.png",
    items: [
      "No loose, damaged or exposed wires.",
      "No loose broken plugs."
    ]
  },
  {
    title: "Grease",
    type: "warning",
    image: "grease.png",
    items: [
      "Adequately greased chassis.",
      "No missing or damaged grease nipples."
    ]
  },
  {
    title: "Boom Structure",
    type: "critical",
    image: "boom-structure.png",
    items: [
      "Not bent/cracked.",
      "Pins all secured.",
      "No loose/missing bolts."
    ]
  },
  {
    title: "Hydraulic Cylinders",
    type: "warning",
    image: "hydraulic-cylinders.png",
    items: [
      "Good condition – no damage.",
      "No loose fittings.",
      "No oil leaks.",
      "No missing bolts/nuts."
    ]
  },
  {
    title: "Hydraulic Hoses and Fittings",
    type: "warning",
    image: "hydraulic-hoses.png",
    items: [
      "No excessive rubbing.",
      "No loose brackets/bolts/nuts.",
      "Smooth operation.",
      "Jaws not cracked or broken."
    ]
  },
  {
    title: "Grab",
    type: "warning",
    image: "grab.png",
    items: [
      "No leaking/rubbing pipes.",
      "No loose brackets/bolts/nuts.",
      "Smooth operation.",
      "Jaws not cracked."
    ]
  },
  {
    title: "Tracks & Sprockets",
    type: "warning",
    image: "tracks-sprockets.png",
    items: [
      "Tracks are aligned.",
      "Not damaged or worn.",
      "No cracks.",
      "No bolts/pins loose or missing."
    ]
  },
  {
    title: "All Excess Loose Debris Removed Pre-Shift",
    type: "warning",
    image: "all-excess-loose-debris.png",
    items: [
      "Battery are/exhaust area.",
      "Behind the boom/hydraulic cooler.",
      "Engine bay."
    ]
  },
  {
    title: "Escape Hatch & Hammer",
    type: "critical",
    image: "escape-hatch.png",
    items: [
      "Test the escape hatch opening.",
      "Escape hammer is easily accessible."
    ]
  },
  {
    title: "Communication",
    type: "warning",
    image: "communication.png",
    items: [
      "Radio or cell phone in working condition.",
      "Handheld panic alarm functional."
    ]
  },
  {
    title: "Fire Systems",
    type: "critical",
    image: "fire-system.png",
    items: [
      "Gauge light working/no warning lights.",
      "No damaged hoses.",
      "Secured/service/seal in place.",
      "Gauges in order."
    ]
  }
]

// Flatten all items for progress and state
const allItems = sections.flatMap(section => section.items)

export function ExcavatorLoaderForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionData, setSubmissionData] = useState<any>(null)
  const [automaticNumber, setAutomaticNumber] = useState("")

  // ---------- Operator Information ----------
  const [formData, setFormData] = useState({
    operatorName: "",
    shift: "",
    date: "",
    hourMeterStart: "",
    hourMeterStop: "",
    validTrainingCard: "",
    unitNumber: "",
  })

  // ---------- Document Reference Data ----------
  const [docRefData, setDocRefData] = useState({
    documentRefNo: "HSEMS / 8.1.19 / REG / 01",
    author: "HSE MANAGER",
    revision: "4",
    creationDate: "2024-03-27",
  })

  // ---- Safe Client Pathname and Document Number ----
  const [pathname, setPathname] = useState("")
  const [documentNo, setDocumentNo] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname)
      const date = new Date()
      const generatedNo = `EL-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`
      setDocumentNo(generatedNo)
      setFormData(prev => ({
        ...prev,
        date: date.toISOString().split("T")[0]
      }))
    }
  }, [])

  // ---------- Inspection Items ----------
  const [items, setItems] = useState<Record<string, CheckStatus>>(
    Object.fromEntries(allItems.map((item) => [item, null]))
  )

  // ---------- Defect Details ----------
  const [defectDetails, setDefectDetails] = useState("")

  // ---------- Signature Pad ----------
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureImage, setSignatureImage] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = 400
    const height = 120
    canvas.width = width
    canvas.height = height

    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#000000"

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = "#cccccc"
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    const { x, y } = getCanvasCoordinates(e)
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { x, y } = getCanvasCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      setSignatureImage(canvas.toDataURL("image/png"))
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#cccccc"
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1)
    setSignatureImage(null)
  }

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ("touches" in e) {
      const touch = e.touches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    } else {
      return {
        x: e.nativeEvent.offsetX * scaleX,
        y: e.nativeEvent.offsetY * scaleY,
      }
    }
  }

  // ---------- Computed Values ----------
  const hasDefects = useMemo(() => Object.values(items).some((s) => s === "def"), [items])
  const allItemsChecked = useMemo(() => Object.values(items).every((s) => s !== null), [items])
  const checkedCount = useMemo(() => Object.values(items).filter((s) => s !== null).length, [items])

  // ---------- Item Change Handler ----------
  const handleItemChange = (label: string, value: CheckStatus) => {
    setItems((prev) => ({ ...prev, [label]: value }))
  }

  // ---------- Submit Handler ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.operatorName || !formData.unitNumber) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!allItemsChecked) {
      toast.error("Please check all inspection items")
      return
    }

    if (hasDefects && !defectDetails.trim()) {
      toast.error("Please provide details for the defects")
      return
    }

    if (!signatureImage) {
      toast.error("Please provide your signature")
      return
    }

    setIsSubmitting(true)

    // Generate Auto Number
    const autoNum = Math.floor(2000 + Math.random() * 9000).toString()
    setAutomaticNumber(autoNum)

    try {
      const submission = {
        formType: "excavator-loader",
        formTitle: "Excavator Loader Pre-Shift Inspection Checklist",
        submittedBy: formData.operatorName,
        submittedAt: new Date().toISOString(),
        hasDefects,
        data: {
          ...formData,
          ...docRefData,
          items,
          hasDefects,
          defectDetails,
          signature: signatureImage,
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
        router.push(`/login?callbackUrl=${pathname}`)
        return
      }

      if (response.ok) {
        const result = await response.json()
        setSubmissionData({ ...submission, id: result.id })
        toast.success("Checklist submitted successfully!")
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
          <p className="text-lg text-gray-500">The Excavator Loader Pre-Shift Inspection has been recorded.</p>
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        {/* ===== HEADER ===== */}
        <div className="flex flex-col items-center space-y-4 border-b-2 border-gray-100 pb-6 mb-8">
          <div className="flex w-full items-start justify-between">
            <Image
              src="/images/ringomode-logo.png"
              alt="Ringomode Logo"
              width={220}
              height={70}
              className="object-contain"
            />
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-extrabold text-[#4e8c31] uppercase tracking-tight">HSE Management System</h1>
              <h2 className="text-3xl font-extrabold text-[#4e8c31] underline decoration-[#4e8c31] underline-offset-8 mt-2">
                Excavator Loader Pre-Shift Inspection Checklist
              </h2>
            </div>
            <div className="w-[220px]" /> {/* Spacer for balance */}
          </div>
        </div>

        {/* ===== GENERAL INSTRUCTIONS ===== */}
        <div className="text-center space-y-3 mb-12">
          <h3 className="text-xl font-extrabold text-[#4e8c31] underline decoration-[#4e8c31] underline-offset-4 mb-6">
            General Instructions for Checklist:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base font-extrabold text-gray-900 px-10">
            <div className="underline decoration-blue-500 decoration-2 underline-offset-4">1. Select "Ok" if in order.</div>
            <div className="underline decoration-blue-500 decoration-2 underline-offset-4">2. Select "Def" for any defect.</div>
            <div className="underline decoration-blue-500 decoration-2 underline-offset-4">3. Select "N/A" if not applicable.</div>
          </div>
        </div>

        {/* ===== METADATA GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 border-b border-gray-100">
          <div className="space-y-2">
            <Label htmlFor="operatorName" className="text-base font-bold text-gray-900">Operators Name & Surname</Label>
            <Select
              value={formData.operatorName}
              onValueChange={(val) => setFormData((p) => ({ ...p, operatorName: val }))}
            >
              <SelectTrigger id="operatorName" className="h-12 rounded-none border-gray-300 text-base">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="John Smith" className="text-base">John Smith</SelectItem>
                <SelectItem value="Jane Doe" className="text-base">Jane Doe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shift" className="text-base font-bold text-gray-900">Select Shift</Label>
            <Select
              value={formData.shift}
              onValueChange={(val) => setFormData((p) => ({ ...p, shift: val }))}
            >
              <SelectTrigger id="shift" className="h-12 rounded-none border-gray-300 text-base">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Day Shift" className="text-base">Day Shift</SelectItem>
                <SelectItem value="Night Shift" className="text-base">Night Shift</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-base font-bold text-gray-900">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
              className="h-12 rounded-none border-gray-300 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourMeterStart" className="text-base font-bold text-gray-900">Hour Meter Start</Label>
            <Input
              id="hourMeterStart"
              value={formData.hourMeterStart}
              onChange={(e) => setFormData((p) => ({ ...p, hourMeterStart: e.target.value }))}
              className="h-12 rounded-none border-gray-300 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourMeterStop" className="text-base font-bold text-gray-900">Hour Meter Stop</Label>
            <Input
              id="hourMeterStop"
              value={formData.hourMeterStop}
              onChange={(e) => setFormData((p) => ({ ...p, hourMeterStop: e.target.value }))}
              className="h-12 rounded-none border-gray-300 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="validTrainingCard" className="text-base font-bold text-gray-900">Valid Training Card (Exp Date)</Label>
            <Input
              id="validTrainingCard"
              type="date"
              value={formData.validTrainingCard}
              onChange={(e) => setFormData((p) => ({ ...p, validTrainingCard: e.target.value }))}
              className="h-12 rounded-none border-gray-300 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitNumber" className="text-base font-bold text-gray-900">Unit Number</Label>
            <Input
              id="unitNumber"
              value={formData.unitNumber}
              onChange={(e) => setFormData((p) => ({ ...p, unitNumber: e.target.value }))}
              className="h-12 rounded-none border-gray-300 text-base"
            />
          </div>
        </div>

        <div className="w-full border-t border-gray-900 my-8" />

        {/* ===== INSPECTION ITEMS – GROUPED BY SECTION ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">Inspection Items</CardTitle>
          </CardHeader>
          <div className="space-y-0 border-t border-gray-200">
            {sections.map((section: any, sectionIdx: number) => (
              <div key={section.title} className="py-8 border-b border-gray-200 hover:bg-gray-50/30 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_210px_180px] gap-8 items-center px-4">
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-gray-900">
                      {section.title}:
                    </h4>
                    <ul className="space-y-2 list-disc pl-5">
                      {section.items.map((item: string, idx: number) => (
                        <li key={idx} className="text-base text-gray-700 font-medium">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="relative w-[208px] h-[151px] border border-gray-100 rounded-none bg-white p-2 shadow-sm flex items-center justify-center overflow-hidden">
                      {section.image && (
                        <div className="relative w-full h-full">
                          <Image
                            src={`/images/${section.image}`}
                            alt={section.title}
                            fill
                            className="object-contain"
                          />
                          {section.title === "License and Phepha" && (
                            <div className="absolute -right-2 -top-2 flex h-14 w-14 items-center justify-center rounded-full border border-black bg-white p-1 text-center text-[9px] font-bold leading-tight shadow-md z-10 transition-transform hover:scale-110">
                              Phepha<br />Valid
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 flex flex-col items-center md:items-start">
                    <Label className="text-sm font-bold text-[#4e8c31] uppercase">Select Status</Label>
                    <Select
                      onValueChange={(val) => {
                        // Update all items in this section to the selected value
                        section.items.forEach((item: string) => handleItemChange(item, val as CheckStatus))
                      }}
                    >
                      <SelectTrigger className="h-12 w-full rounded-none border-gray-200 bg-white text-base">
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
        </Card>

        {/* ===== DEFECTS SECTION ===== */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-900 uppercase">Are There Any Defects Selected</Label>
            <Select
              value={hasDefects ? "yes" : "no"}
              onValueChange={(val) => {
                if (val === "no") {
                  // If switching to no, we should ideally clear defect flags or ignore it
                  // But the logic is driven by the items themselves
                }
              }}
            >
              <SelectTrigger className="rounded-none border-gray-300 w-full md:w-1/3">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-900">Details of Defects (If "Def" is selected, please specify defects here)</Label>
            <Textarea
              value={defectDetails}
              onChange={(e) => setDefectDetails(e.target.value)}
              placeholder=""
              rows={4}
              className="resize-none rounded-none border-gray-300"
              required={hasDefects}
            />
          </div>
        </div>

        {/* ===== SIGNATURE SECTION ===== */}
        <div className="space-y-4 pt-10 border-t border-gray-200">
          <Label className="text-sm font-bold text-gray-900">Signature</Label>
          <div className="border border-gray-300 p-1 w-full max-w-[400px] bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-[120px] touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={clearSignature} className="rounded-none">Clear</Button>
            <Button type="button" variant="outline" size="sm" className="rounded-none">Undo</Button>
          </div>
        </div>

        {/* ===== Standard Metadata Footer ===== */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border border-gray-200 bg-gray-50/50 mt-12">
          {[
            { label: "Document Reference No.", value: docRefData.documentRefNo },
            { label: "Author", value: docRefData.author },
            { label: "Revision", value: docRefData.revision },
            { label: "Creation Date", value: docRefData.creationDate },
            { label: "Automatic Number", value: automaticNumber, isAuto: true },
          ].map(meta => (
            <div key={meta.label} className="p-4 border-r border-gray-200 last:border-r-0">
              <Label className="text-[10px] font-bold text-gray-500 uppercase">{meta.label}</Label>
              <div className={`text-xs font-medium mt-1 ${meta.isAuto ? "text-gray-900 font-bold" : "text-gray-600"}`}>
                {meta.isAuto && !automaticNumber ? <span className="text-gray-400 italic">Generated on Submit</span> : meta.value}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-8">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#fbb016] hover:bg-[#e5a014] text-black font-bold h-10 px-12 rounded-none shadow-sm"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  )
}
