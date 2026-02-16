"use client"

import React, { useRef, useState, useMemo, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
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
import { AlertTriangle, CheckCircle2, Send, ArrowLeft, AlertCircle, Eraser } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// ---- SECTION DEFINITIONS for Excavator Loader (grouped logically) ----
const sections = [
  {
    title: "Fire & Safety Equipment",
    items: [
      "Fire extinguisher (serviced/sealed)",
      "First aid kit"
    ]
  },
  {
    title: "Operator Environment",
    items: [
      "Seat belt",
      "Mirrors",
      "Lights (head/tail/work)",
      "Horn / reverse alarm",
      "Windscreen / wipers",
      "Steps / handrails",
      "Guards / covers in place",
      "Cabin (clean/undamaged)"
    ]
  },
  {
    title: "Fluids & Filters",
    items: [
      "Engine oil level",
      "Hydraulic oil level",
      "Coolant level",
      "Fuel level",
      "Air filter indicator"
    ]
  },
  {
    title: "Electrical",
    items: [
      "Battery (condition/terminals)"
    ]
  },
  {
    title: "Undercarriage & Attachments",
    items: [
      "Tracks / undercarriage",
      "Bucket (teeth/cutting edge)",
      "Boom / stick / linkage pins",
      "Hydraulic hoses / fittings",
      "Slew ring / bearing",
      "Swing mechanism"
    ]
  },
  {
    title: "Exhaust & Instruments",
    items: [
      "Exhaust system",
      "Instruments / gauges",
      "Controls (levers/pedals)"
    ]
  },
  {
    title: "Brakes & Steering",
    items: [
      "Brakes (service/park)",
      "Steering"
    ]
  },
  {
    title: "Wheels & Tyres",
    items: [
      "Tyres / wheels (if applicable)"
    ]
  },
  {
    title: "Lubrication & Leaks",
    items: [
      "Grease points",
      "No leaks (oil/fuel/coolant)"
    ]
  },
  {
    title: "Loader & Quick Hitch",
    items: [
      "Loader arms / linkage",
      "Quick hitch (if fitted)",
      "Attachments secure"
    ]
  }
]

// Flatten all items for progress and state
const allItems = sections.flatMap(section => section.items)

// Map section titles to illustrative images (use images from public/images when available)
const sectionImages: Record<string, string | undefined> = {
  "Fire & Safety Equipment": "fire-system.png",
  "Operator Environment": "cabs.png",
  "Fluids & Filters": "air-pre-cleaner.png",
  "Electrical": "battery.png",
  "Undercarriage & Attachments": "tracks-sprockets.png",
  "Exhaust & Instruments": "exhaust.png",
  "Brakes & Steering": "gauges.png",
  "Wheels & Tyres": "tracks-sprockets.png",
  "Lubrication & Leaks": "grease.png",
  "Loader & Quick Hitch": "boom-structure.png",
}

export function ExcavatorLoaderForm() {
  const router = useRouter()
  const pathname = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ---------- Operator Information ----------
  const [formData, setFormData] = useState({
    operatorName: "",
    shift: "",
    date: new Date().toISOString().split("T")[0],
    hourMeterStart: "",
    hourMeterStop: "",
    validTrainingCard: "",
    unitNumber: "",
  })

  // ---------- Auto‑generate Document Number ----------
  const documentNo = useMemo(() => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    return `EL-${year}${month}${day}-${random}`
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

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "excavator-loader",
          formTitle: "Excavator Loader Pre-Shift Inspection Checklist",
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
    } catch {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6 p-4 pb-12 lg:p-8 lg:pb-16">
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
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="grid grid-cols-3 items-center gap-4">
          {/* Left: logo */}
          <div className="flex items-start">
            <Image
              src="/images/ringomode-logo.png"
              alt="Ringomode DSP logo"
              width={160}
              height={50}
              className="object-contain"
            />
          </div>

          {/* Center: headings (stacked, centered) */}
          <div className="text-center">
            <h1 className="text-xl font-semibold text-emerald-700">HSE Management System</h1>
            <h2 className="text-xl font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-4">
              Excavator Loader Pre-Shift Inspection
            </h2>
          </div>

          {/* Right: completion */}
          <div className="flex flex-col items-end">
            <ChecklistStatusBadge completion={Math.round((checkedCount / allItems.length) * 100)} />
            <span className="text-sm text-gray-600 mt-1">{Math.round((checkedCount / allItems.length) * 100)}% Complete</span>
          </div>
        </div>
      </Card>

      {/* ===== GENERAL INSTRUCTIONS ===== */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-semibold text-amber-800">
              General Instructions for Checklist:
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700">
            The operator is to conduct a 10 minute physical walkabout of the machinery on a daily basis
            and assess the condition of the attachment.
          </p>
          <p className="mt-2 text-sm text-amber-700">
            Outcome to be detailed with an "Ok" if in order and a "Def" if defective. Defective outcomes
            to be documented below.
          </p>
        </CardContent>
      </Card>

      {/* ===== OPERATOR INFORMATION ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Operator Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="operatorName" className="text-foreground">
              Operators Name & Surname <span className="text-destructive">*</span>
            </Label>
            <Input
              id="operatorName"
              value={formData.operatorName}
              onChange={(e) => setFormData((p) => ({ ...p, operatorName: e.target.value }))}
              placeholder="Enter operator name"
              required
            />
          </div>

          {/* Auto-generated Document Number */}
          <div className="space-y-2">
            <Label htmlFor="documentNo" className="text-foreground">Document No.</Label>
            <Input
              id="documentNo"
              value={documentNo}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shift" className="text-foreground">Select Shift</Label>
            <Select
              value={formData.shift}
              onValueChange={(val) => setFormData((p) => ({ ...p, shift: val }))}
            >
              <SelectTrigger id="shift">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day Shift</SelectItem>
                <SelectItem value="night">Night Shift</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourMeterStop" className="text-foreground">Hour Meter Stop</Label>
            <Input
              id="hourMeterStop"
              type="number"
              value={formData.hourMeterStop}
              onChange={(e) => setFormData((p) => ({ ...p, hourMeterStop: e.target.value }))}
              placeholder="e.g. 1262"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourMeterStart" className="text-foreground">Hour Meter Start</Label>
            <Input
              id="hourMeterStart"
              type="number"
              value={formData.hourMeterStart}
              onChange={(e) => setFormData((p) => ({ ...p, hourMeterStart: e.target.value }))}
              placeholder="e.g. 1250"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="validTrainingCard" className="text-foreground">Valid Training Card (Exp Date)</Label>
            <Input
              id="validTrainingCard"
              type="date"
              value={formData.validTrainingCard}
              onChange={(e) => setFormData((p) => ({ ...p, validTrainingCard: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitNumber" className="text-foreground">
              Unit Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="unitNumber"
              value={formData.unitNumber}
              onChange={(e) => setFormData((p) => ({ ...p, unitNumber: e.target.value }))}
              placeholder="e.g. EXC-L-001"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* ===== QUICK REFERENCE ===== */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <h3 className="mb-2 text-sm font-semibold text-foreground">Quick Reference:</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-md bg-green-100 p-2 text-green-700">OK - In order</div>
            <div className="rounded-md bg-red-100 p-2 text-red-700">DEF - Defective</div>
            <div className="rounded-md bg-gray-100 p-2 text-gray-700">N/A - Not applicable</div>
          </div>
        </CardContent>
      </Card>

      {/* ===== PROGRESS ===== */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Progress: {checkedCount} / {allItems.length} items checked
        </span>
        {allItemsChecked && (
          <span className="flex items-center gap-1 text-[hsl(142,76%,36%)]">
            <CheckCircle2 className="h-4 w-4" />
            All items checked
          </span>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(checkedCount / allItems.length) * 100}%` }}
        />
      </div>

      {/* ===== INSPECTION ITEMS – GROUPED BY SECTION ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Inspection Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section, sectionIdx) => {
            const img = sectionImages[section.title]
            return (
              <div key={sectionIdx} className="space-y-2">
                <h4 className="text-sm font-semibold text-primary">{section.title}</h4>

                {/* render section image (when available) to mirror DocuWare visuals */}
                {img && (
                  <div className="flex justify-center py-6">
                    <Image
                      src={`/images/${img}`}
                      alt={`${section.title} icon`}
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                )}

                <div className="ml-4 space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <ChecklistRadioGroup
                      key={`${sectionIdx}-${itemIdx}`}
                      label={item}
                      value={items[item]}
                      onChange={(val) => handleItemChange(item, val)}
                      index={itemIdx}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* ===== DEFECTS SECTION ===== */}
      {hasDefects && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Defects Detected
            </CardTitle>
            <CardDescription>
              Are There Any Defects Selected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label className="text-sm font-medium">Details of Defects (If "Def" is selected, please specify defects here)</Label>
            <Textarea
              value={defectDetails}
              onChange={(e) => setDefectDetails(e.target.value)}
              placeholder={"Details of Defects (If \"Def\" is selected, please specify defects here)"}
              rows={4}
              className="resize-none mt-2"
              required={hasDefects}
            />
          </CardContent>
        </Card>
      )}

      {/* ===== SIGNATURE PAD ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Signature</CardTitle>
          <CardDescription>
            Draw your signature using your mouse or touchpad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              className="w-full max-w-[400px] h-[120px] border rounded-md touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
            />
            <div className="flex gap-2 mt-3 self-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSignature}
                className="gap-2"
              >
                <Eraser className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-muted/20 bg-muted/5">
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="text-sm">
            <div className="font-medium">Document Reference No</div>
            <div className="text-xs text-muted-foreground mt-1">HSEMS / 8.1.19 / REG / 002</div>
          </div>
          <div className="text-sm">
            <div className="font-medium">Author</div>
            <div className="text-xs text-muted-foreground mt-1">HSE MANAGER</div>
          </div>
          <div className="text-sm">
            <div className="font-medium">Revision</div>
            <div className="text-xs text-muted-foreground mt-1">4</div>
          </div>
          <div className="text-sm">
            <div className="font-medium">Creation Date</div>
            <div className="text-xs text-muted-foreground mt-1">03/27/2020</div>
          </div>
          <div className="text-sm col-span-2">
            <div className="font-medium">Automatic Number</div>
            <div className="text-xs text-muted-foreground mt-1">{documentNo}</div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* ===== SUBMIT BUTTONS ===== */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/">Cancel</Link>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit Checklist"}
        </Button>
      </div>
    </form>
  )
}