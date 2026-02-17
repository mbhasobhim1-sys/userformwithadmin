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
import { AlertTriangle, CheckCircle2, Send, ArrowLeft, AlertCircle, Eraser } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const skidderItems = [
  "License and Phepha: Phepha valid / Displayed and visible",
  "Protective Structure: No cracks/damages / No bolts missing/loose / Guards not damaged and intact",
  "Exhaust: Clamps secure / No excessive smoking/blowing",
  "Cab: Cab neat and tidy / Door and mechanism working / Door rubber in good condition / Door handles functional",
  "Windscreen, Windows & Wipers: Clean/secure / No cracks or damages to windscreen / Window visibility not obscured by cracks / Wipers are working",
  "Seats: Condition of seat / Seat secured / Rotating lock functional / Seat adjuster functional",
  "Safety Belt: Safety belts bolted/secured / No damage / Retractor clip functional",
  "Hooter and Reverse Alarm: Hooter working and in good condition / Reverse alarm working",
  "Gauges: In working order / Any warning symbols/lights",
  "Hydraulic Controls: Not loose/responsive / No steering play / Rear steering / Pivot/steering ram pins not loose",
  "Working Lights (LED): In working order (if LED's, 2 thirds must be working)",
  "Rotating Light: Flashing/rotating beacon light in working condition",
  "Foot Brake: In working order / Check brake fluid levels in order",
  "Emergency Park Brake: Working",
  "Battery: Secure / Sufficient water / Terminals clean/tight & covers on / No exposed wiring",
  "Air Pre-Cleaner: Good condition / Clean and secure / No dust in pre-cleaner bowl",
  "Radiator: Secure / Water level correct / No signs of leaking",
  "Fan Belt: No squeaking / No signs of damage",
  "Oil/Fluid/Air Levels: Check all oil levels/brake fluid levels/clutch fluid levels are correct / Check air gauge in order",
  "Fuel, Air and Oil leaks: No more than 4 drops of oil per minute",
  "Grease: Adequately greased chassis / No missing or damaged grease nipples",
  "Tyres: No excessive wear and tear / No loose/missing/damaged nuts / Wheel nuts secure",
  "Hydraulic Cylinders: Good condition – no damage / No loose fittings / No oil leaks / No missing bolts/nuts",
  "Hydraulic Hoses and Fittings: No excessive rubbing / No loose brackets/bolts/nuts / Smooth operation / Jaws not cracked or broken",
  "Winch: Condition of cable good / Condition of drum good / Clutch and brake working / Roller guides in good condition",
  "Tackle: Cable/chains/hooks/slings/chocker chains/tag lines and sliders all in good condition / No fraying or damage",
  "Communication: Radio or cell phone in working condition / Handheld panic alarm functional",
  "Fire Extinguisher: In working order / Serviced / Gauge in order / Seal in place",
] as const

export default function SkidderPreShiftInspectionForm() {
  const router = useRouter()
  const pathname = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    operatorName: "",
    machineNumber: "",
    date: new Date().toISOString().split("T")[0],
    hourMeterStart: "",
    hourMeterStop: "",
    validTrainingCard: "",
  })

  const documentNo = useMemo(() => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    return `SK-${year}${month}${day}-${random}`
  }, [])

  const [items, setItems] = useState<Record<string, CheckStatus>>(
    Object.fromEntries((skidderItems as readonly string[]).map((i) => [i, null]))
  )

  const [defectDetails, setDefectDetails] = useState("")

  // Signature pad
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
    if (canvas) setSignatureImage(canvas.toDataURL("image/png"))
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

  const handleItemChange = (label: string, value: CheckStatus) => {
    setItems((prev) => ({ ...prev, [label]: value }))
  }

  const hasDefects = useMemo(() => Object.values(items).some((s) => s === "def"), [items])
  const allItemsChecked = useMemo(() => Object.values(items).every((s) => s !== null), [items])

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
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "skidder-pre-shift-inspection",
          formTitle: "Skidder (Grapple & Cable) Pre-Shift Inspection Checklist",
          submittedBy: formData.operatorName,
          hasDefects,
          data: {
            ...formData,
            documentNo,
            items,
            hasDefects,
            defectDetails,
            signature: signatureImage,
          },
        }),
      })

      if (response.status === 401) {
        toast.error("Session expired — please sign in")
        router.push(`/login?callbackUrl=${pathname}`)
        return
      }

      if (response.ok) {
        toast.success("Checklist submitted successfully!")
        router.push("/")
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

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="flex items-start">
            <Image src="/images/ringomode-logo.png" alt="Ringomode DSP logo" width={160} height={50} className="object-contain" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-emerald-700">HSE Management System</h1>
            <h2 className="text-xl font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-4">Skidder (Grapple & Cable) Pre-Shift Inspection Checklist</h2>
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

      <div className="space-y-4">
        {(skidderItems as readonly string[]).map((label, idx) => (
          <ChecklistRadioGroup key={label} index={idx} label={label} value={items[label]} onChange={(v) => handleItemChange(label, v)} />
        ))}
      </div>

      <div>
        <Label>Are There Any Defects Selected?</Label>
        <select className="mt-2 block w-full rounded border border-border bg-card px-3 py-2 text-sm" value={hasDefects ? "yes" : "no"} disabled>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      <div>
        <Label>Details of Defects (If "Def" is selected, please specify defects here)</Label>
        <Textarea value={defectDetails} onChange={(e) => setDefectDetails(e.target.value)} rows={4} />
      </div>

      <div className="space-y-2">
        <Label>Signature</Label>
        <div className="rounded border border-border p-2">
          <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="w-full" />
          <div className="mt-2 flex gap-2">
            <Button type="button" variant="ghost" onClick={clearSignature} className="gap-2">Clear</Button>
            <Button type="submit" disabled={isSubmitting} className="ml-auto">
              {isSubmitting ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
