"use client"

import React, { useRef, useState, useMemo, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChecklistRadioGroup } from "@/components/checklist-radio-group"
import { ChecklistStatusBadge } from "@/components/checklist-status-badge"
import { type CheckStatus } from "@/lib/types"
import { CheckCircle2, Send, ArrowLeft, AlertCircle, Eraser, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const sections = [
  { title: "License and Phepha", items: ["Phepha valid", "Displayed and visible"] },
  { title: "Protective Structure", items: ["No cracks/damages", "No bolts missing/loose", "Guards not damaged and intact"] },
  { title: "Exhaust", items: ["Clamps secure", "No excessive smoking/blowing"] },
  { title: "Cab", items: ["Cab neat and tidy", "Door and mechanism working", "Door rubber in good condition", "Door handles functional"] },
  { title: "Windscreen, Windows & Wipers", items: ["Clean/secure", "No cracks or damages to windscreen", "Window visibility not obscured by cracks", "Wipers are working"] },
  { title: "Seats", items: ["Condition of seat", "Seat secured", "Rotating lock functional", "Seat adjuster functional"] },
  { title: "Safety Belt", items: ["Safety belts bolted/secured", "No damage", "Retractor clip functional"] },
  { title: "Hooter and Reverse Alarm", items: ["Hooter working and in good condition", "Reverse alarm working"] },
  { title: "Gauges", items: ["In working order", "Any warning symbols/lights"] },
  { title: "Hydraulic Controls", items: ["Not loose/responsive", "No steering play", "Rear steering", "Pivot/steering ram pins not loose"] },
  { title: "Working Lights (LED)", items: ["In working order", "If LED's, 2 thirds must be working"] },
  { title: "Rotating Light", items: ["Flashing/rotating beacon light in working condition"] },
  { title: "Foot Brake", items: ["In working order", "Check brake fluid levels in order"] },
  { title: "Emergency Park Brake", items: ["Working"] },
  { title: "Battery", items: ["Secure", "Sufficient water", "Terminals clean/tight & covers on", "No exposed wiring"] },
  { title: "Air Pre-Cleaner", items: ["Good condition - no damage/no sucking of air", "Clean and secure", "No dust in pre-cleaner bowl"] },
  { title: "Radiator", items: ["Secure", "Water level correct", "No signs of leaking"] },
  { title: "Fan Belt", items: ["No squeaking", "No signs of damage"] },
  { title: "Oil/Fluid/Air Levels", items: ["Check all oil levels/brake fluid levels/clutch fluid levels are correct", "Check air gauge in order"] },
  { title: "Fuel, Air and Oil leaks", items: ["No more than 4 drops of oil per minute"] },
  { title: "Grease", items: ["Adequately greased chassis", "No missing or damaged grease nipples"] },
  { title: "Tyres", items: ["No excessive wear and tear", "No loose/missing/damaged nuts", "Wheel nuts secure"] },
  { title: "Hydraulic Cylinders", items: ["Good condition – no damage", "No loose fittings", "No oil leaks", "No missing bolts/nuts"] },
  { title: "Hydraulic Hoses and Fittings", items: ["No excessive rubbing", "No loose brackets/bolts/nuts", "Smooth operation", "Jaws not cracked or broken"] },
  { title: "Winch", items: ["Condition of cable good", "Condition of drum good", "Clutch and brake working", "Roller guides in good condition"] },
  { title: "Tackle", items: ["Cable/chains/hooks/slings/chocker chains/tag lines and sliders all in good condition", "No fraying or damage"] },
  { title: "Communication", items: ["Radio or cell phone in working condition", "Handheld panic alarm functional"] },
  { title: "Fire Extinguisher", items: ["In working order", "Serviced", "Gauge in order", "Seal in place"] },
] as const

const allItems = sections.flatMap((section) => section.items)

const renderGroupedSection = (
  title: string,
  items: string[] | readonly string[],
  iconSrc: string,
  secondIconSrc: string | null,
  itemState: Record<string, CheckStatus>,
  onItemChange: (label: string, value: CheckStatus) => void
) => {
  return (
    <div key={title} className="space-y-4 pb-6 border-b border-gray-100 last:border-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Left: Title and Bulleted Items */}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-gray-900 border-l-4 border-primary pl-3 mb-3">{title}:</h4>
          <ul className="ml-6 list-disc space-y-2 text-sm text-gray-700 font-medium">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Center: Icons */}
        <div className="flex items-center gap-10 py-4">
          {/* Main Section Icon (machine part) */}
          <div className="w-32 h-32 relative flex items-center justify-center p-2 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image src={iconSrc} alt={`${title} icon`} width={110} height={110} className="object-contain relative z-10" />
              <div className="absolute inset-0 flex items-center justify-center -z-0">
                <Info className="h-16 w-16 text-gray-100" />
              </div>
            </div>
          </div>

          {/* Secondary Badge/Icon (validation stamp) */}
          {secondIconSrc && (
            <div className="w-28 h-28 relative flex items-center justify-center p-2 bg-transparent overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={secondIconSrc}
                  alt=""
                  width={80}
                  height={80}
                  className="object-contain relative z-10"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = '0';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Select Dropdown */}
        <div className="w-full md:w-40 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Status Control</Label>
          <Select
            value={itemState[items[0]] || ""}
            onValueChange={(val) => {
              items.forEach(item => onItemChange(item, val as CheckStatus))
            }}
          >
            <SelectTrigger className="w-full bg-white border-gray-300 h-11 shadow-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ok" className="text-green-700 font-bold">OK - In Order</SelectItem>
              <SelectItem value="def" className="text-red-700 font-bold">DEF - Defective</SelectItem>
              <SelectItem value="na" className="text-gray-600 font-bold">N/A - Not Applicable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default function SkidderPreShiftInspectionForm() {
  const router = useRouter()
  const pathname = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [documentNo, setDocumentNo] = useState("")

  const [formData, setFormData] = useState({
    operatorName: "",
    machineNumber: "",
    date: "", // Initial empty to prevent hydration mismatch
    hourMeterStart: "",
    hourMeterStop: "",
    validTrainingCard: "",
  })

  const [items, setItems] = useState<Record<string, CheckStatus>>(
    Object.fromEntries(allItems.map((i) => [i, null]))
  )

  const [defectDetails, setDefectDetails] = useState("")

  // Signature pad
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureImage, setSignatureImage] = useState<string | null>(null)
  const [drawingHistory, setDrawingHistory] = useState<string[]>([])

  useEffect(() => {
    // Generate Document No on client only
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    setDocumentNo(`SK-${year}${month}${day}-${random}`)

    // Set today's date
    setFormData(prev => ({ ...prev, date: date.toISOString().split("T")[0] }))
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

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = "#cccccc"
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1)
  }, [])

  const getCanvasCoordinates = (e: any) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if (e.touches) {
      const touch = e.touches[0]
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY }
    } else {
      return { x: e.nativeEvent.offsetX * scaleX, y: e.nativeEvent.offsetY * scaleY }
    }
  }

  const startDrawing = (e: any) => {
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

  const draw = (e: any) => {
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
      const dataUrl = canvas.toDataURL("image/png")
      setSignatureImage(dataUrl)
      setDrawingHistory(prev => [...prev.slice(-19), dataUrl]) // Keep last 20 states
    }
  }

  const undoSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (drawingHistory.length <= 1) {
      clearSignature()
      return
    }

    const newHistory = [...drawingHistory]
    newHistory.pop() // Remove current state
    const previousState = newHistory[newHistory.length - 1]

    const img = new (window as any).Image()
    img.src = previousState
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      setSignatureImage(previousState)
      setDrawingHistory(newHistory)
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
    setDrawingHistory([])
  }

  const handleItemChange = (label: string, value: CheckStatus) => {
    setItems((prev) => ({ ...prev, [label]: value }))
  }

  const hasDefects = useMemo(() => Object.values(items).some((s) => s === "def"), [items])
  const allItemsChecked = useMemo(() => Object.values(items).every((s) => s !== null), [items])

  const [submitted, setSubmitted] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.operatorName || !formData.machineNumber) {
      toast.error("Please fill in required fields")
      return
    }

    if (!allItemsChecked) {
      toast.error("Please check all inspection items")
      return
    }

    if (hasDefects && !defectDetails.trim()) {
      toast.error("Please provide details for defects")
      return
    }

    if (!signatureImage) {
      toast.error("Please provide your signature")
      return
    }

    setIsSubmitting(true)

    try {
      const submissionData = {
        ...formData,
        documentNo,
        items,
        hasDefects,
        defectDetails,
        signature: signatureImage,
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "skidder-pre-shift-inspection",
          formTitle: "Skidder (Grapple & Cable) Pre-Shift Inspection Checklist",
          submittedBy: formData.operatorName,
          hasDefects,
          data: submissionData,
        }),
      })

      if (response.status === 401) {
        toast.error("Session expired — please sign in")
        router.push(`/login?callbackUrl=${pathname}`)
        return
      }

      if (response.ok) {
        const result = await response.json()
        toast.success("Checklist submitted successfully!")
        setSubmissionId(result.id)
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (response.status === 403) {
        toast.error("Forbidden — you do not have permission to submit this form")
      } else {
        const body = await response.json().catch(() => null)
        toast.error(body?.error || "Failed to submit checklist")
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = async () => {
    const { exportSubmissionToPDF } = await import("@/lib/export-utils")
    exportSubmissionToPDF({
      id: submissionId || "temp",
      formType: "skidder-pre-shift-inspection",
      submittedBy: formData.operatorName,
      submittedAt: new Date().toISOString(),
      hasDefects,
      data: {
        ...formData,
        documentNo,
        items,
        defectDetails,
        signature: signatureImage,
      }
    } as any)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl p-4 lg:p-8 space-y-8">
        <Card className="border-emerald-200 bg-emerald-50 p-8 text-center transition-all animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Submission Complete!</h1>
          <p className="text-emerald-700 mb-8">
            The Skidder Pre-Shift Inspection has been recorded successfully.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 text-lg gap-2"
              onClick={handleDownload}
            >
              <Info className="h-5 w-5" />
              Download Form (PDF)
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-emerald-200 h-14 text-lg gap-2"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6 p-4 pb-12 lg:p-8 lg:pb-16">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image src="/images/ringomode-logo.png" alt="Ringomode Logo" width={180} height={60} className="object-contain" />
          </div>

          {/* Titles */}
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-emerald-800 leading-tight">
              HSE Management System
            </h1>
            <h2 className="text-2xl font-bold text-emerald-700 underline decoration-emerald-200 underline-offset-8 mt-2 max-w-xl mx-auto">
              Skidder (Grapple & Cable) Pre-Shift Inspection Checklist
            </h2>
          </div>

          {/* Progress */}
          <div className="flex flex-col items-center md:items-end flex-shrink-0">
            <span className="text-sm font-bold text-emerald-700">
              {Math.round((Object.values(items).filter(v => v !== null).length / allItems.length) * 100)}% Complete
            </span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Operators Name & Surname</Label>
          <Input value={formData.operatorName} onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })} required />
        </div>
        <div>
          <Label>Machine Number</Label>
          <Input value={formData.machineNumber} onChange={(e) => setFormData({ ...formData, machineNumber: e.target.value })} required />
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
        </div>
        <div>
          <Label>Hour Meter Start</Label>
          <Input value={formData.hourMeterStart} onChange={(e) => setFormData({ ...formData, hourMeterStart: e.target.value })} required />
        </div>
        <div>
          <Label>Hour Meter Stop</Label>
          <Input value={formData.hourMeterStop} onChange={(e) => setFormData({ ...formData, hourMeterStop: e.target.value })} required />
        </div>
        <div>
          <Label>Valid Training Card (Exp Date)</Label>
          <Input type="date" value={formData.validTrainingCard} onChange={(e) => setFormData({ ...formData, validTrainingCard: e.target.value })} />
        </div>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-semibold text-amber-800">General Instructions:</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700">
            The operator is to conduct a 10 minute physical walkabout of the machinery on a daily basis and assess the condition.
            Outcome to be detailed with an "Ok" if in order and a "Def" if defective.
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-md bg-green-100 p-2 text-green-700">OK - In order</div>
            <div className="rounded-md bg-red-100 p-2 text-red-700">DEF - Defective</div>
            <div className="rounded-md bg-gray-100 p-2 text-gray-700">N/A - Not applicable</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Inspection Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section) => {
            // Map title to icon. Reuse logic from export-utils if possible, or hardcode here.
            const iconMap: Record<string, string> = {
              "License and Phepha": "license2.png",
              "Protective Structure": "protective-structure.png",
              "Exhaust": "exhaust.png",
              "Cab": "cabs.png",
              "Windscreen, Windows & Wipers": "wipes.png",
              "Seats": "seats.png",
              "Safety Belt": "safety-belt.png",
              "Hooter and Reverse Alarm": "hooters.png",
              "Gauges": "gauges.png",
              "Hydraulic Controls": "hydraulic-controls.png",
              "Working Lights (LED)": "led.png",
              "Rotating Light": "rotating-light.png",
              "Foot Brake": "excavator-loader-brakes-steering.png",
              "Emergency Park Brake": "excavator-loader-brakes-steering.png",
              "Battery": "battery.png",
              "Air Pre-Cleaner": "air-pre-cleaner.png",
              "Radiator": "radiator.png",
              "Fan Belt": "fan-belt.png",
              "Oil/Fluid/Air Levels": "fuel-oil-levels.png",
              "Fuel, Air and Oil leaks": "fuel-leaks.png",
              "Grease": "grease.png",
              "Tyres": "excavator-loader-wheels-tyres.png",
              "Hydraulic Cylinders": "hydraulic-cylinders.png",
              "Hydraulic Hoses and Fittings": "hydraulic-hoses.png",
              "Winch": "hydraulic-hoses.png",
              "Tackle": "hydraulic-hoses.png",
              "Communication": "communication.png",
              "Fire Extinguisher": "fire-system.png",
            }
            const secondIconMap: Record<string, string> = {
              "License and Phepha": "/images/phepha-valid.png",
              // Add more second icons here if needed
            }

            return renderGroupedSection(
              section.title,
              section.items,
              `/images/${iconMap[section.title] || 'ringomode-logo.png'}`,
              secondIconMap[section.title] || null,
              items,
              handleItemChange
            )
          })}
        </CardContent>
      </Card>

      <div className="space-y-6 pt-10 border-t-2 border-gray-300">
        <div>
          <Label className="text-sm font-bold block mb-2">Are There Any Defects Selected</Label>
          <Select
            value={hasDefects ? "yes" : "no"}
            disabled
          >
            <SelectTrigger className="w-full md:w-64 bg-white border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-bold block mb-2">Details of Defects (If "Def" is selected, please specify defects here)</Label>
          <Textarea
            value={defectDetails}
            onChange={(e) => setDefectDetails(e.target.value)}
            rows={4}
            className="border-gray-300 bg-white"
          />
        </div>

        <div>
          <Label className="text-sm font-bold block mb-2">Signature</Label>
          <div className="inline-block rounded border border-gray-300 bg-white p-1">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full sm:w-[500px] h-[150px] cursor-crosshair bg-white"
            />
            <div className="mt-2 flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={clearSignature} className="border-gray-400 bg-gray-50 hover:bg-gray-100 h-8 px-4 font-bold text-gray-700">Clear</Button>
              <Button type="button" variant="outline" size="sm" onClick={undoSignature} className="border-gray-400 bg-gray-50 hover:bg-gray-100 h-8 px-4 font-bold text-gray-700">Undo</Button>
            </div>
          </div>
        </div>

        <div className="pt-10 space-y-8 border-t-2 border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-gray-900 block uppercase">Document Reference No.</Label>
              <div className="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-xs font-semibold text-gray-500 h-10 flex items-center">
                HSEMS / 8.1.19 / REG / 00
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-gray-900 block uppercase">Author</Label>
              <div className="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-xs font-semibold text-gray-500 h-10 flex items-center uppercase">
                HSE Manager
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-gray-900 block uppercase">Revision</Label>
              <div className="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-xs font-semibold text-gray-500 h-10 flex items-center justify-center">
                2
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-gray-900 block uppercase">Creation Date</Label>
              <div className="relative bg-gray-100 border border-gray-200 rounded px-3 py-2 text-xs font-semibold text-gray-500 h-10 flex items-center">
                03/27/2024
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-gray-900 block uppercase">Automatic Number</Label>
              <div className="font-extrabold text-xl text-gray-900 pt-1">
                {documentNo || "2064"}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-48 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold h-12 text-lg rounded shadow-md transition-all active:translate-y-0.5"
            >
              {isSubmitting ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-48 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold h-12 text-lg rounded-none shadow-md transition-all active:translate-y-0.5"
          >
            {isSubmitting ? "Submitting…" : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  )
}
