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
import { excavatorHarvesterItems, type CheckStatus } from "@/lib/types"
import { AlertTriangle, CheckCircle2, Send, ArrowLeft, AlertCircle, Eraser, FileText } from "lucide-react"
import { exportSubmissionToPDF } from "@/lib/export-utils"
import Link from "next/link"
import Image from "next/image"

// --- FULL SECTIONS ARRAY – ALL 34 SECTIONS, COMPLETE -------------
const sections = [
  {
    title: "License and Phepha",
    items: ["Phepha valid.", "Displayed and visible."]
  },
  {
    title: "Protective Structure",
    items: [
      "No cracks/damages.",
      "No bolts missing/loose.",
      "Guards not damaged and intact."
    ]
  },
  {
    title: "Exhaust",
    items: ["Clamps secure.", "No excessive smoking/blowing."]
  },
  {
    title: "Steps and Rails",
    items: ["Steps in good condition.", "Not loose/broken."]
  },
  {
    title: "Cab",
    items: [
      "Cab neat and tidy.",
      "Door and mechanism working.",
      "Door rubber in good condition.",
      "Door handles functional."
    ]
  },
  {
    title: "Windscreen, Windows & Wipers",
    items: [
      "Clean/secure.",
      "No cracks or damages to windscreen.",
      "Window visibility not obscured by cracks.",
      "Wipers are working."
    ]
  },
  {
    title: "Air Conditioner",
    items: ["In working condition."]
  },
  {
    title: "Seats",
    items: [
      "Condition of seat.",
      "Seat secured.",
      "Rotating lock functional.",
      "Seat adjuster functional."
    ]
  },
  {
    title: "Safety Belt",
    items: [
      "Safety belts bolted/secured.",
      "No damage/not extremely dirty/bleached or dyed.",
      "Retractor clip in order and clicks into place."
    ]
  },
  {
    title: "Hooter and Reverse Alarm",
    items: ["Hooter working and in good condition.", "Reverse alarm working."]
  },
  {
    title: "Gauges",
    items: ["In working order.", "Any warning symbols/lights."]
  },
  {
    title: "Hydraulic Controls",
    items: [
      "Not loose/responsive.",
      "No steering play.",
      "Rear steering.",
      "Pivot/steering ram pins not loose."
    ]
  },
  {
    title: "Hydraulic Head Cut Off (Bail Lever)",
    items: [
      "Operational (when it is disengaged, the hydraulics do not operate)."
    ]
  },
  {
    title: "Working Lights (LED)",
    items: [
      "In working order (if LED's, 2 thirds must be working) ie. (If 9 LED's, 6 must be working)."
    ]
  },
  {
    title: "Rotating Light",
    items: ["Flashing/rotating beacon light in working condition."]
  },
  {
    title: "Grill (Sieve)",
    items: [
      "Check condition – no damage.",
      "Not clogged.",
      "Air is moving freely."
    ]
  },
  {
    title: "Battery",
    items: [
      "Secure.",
      "Sufficient water.",
      "Terminals clean/tight & covers on.",
      "No exposed wiring."
    ]
  },
  {
    title: "Radiator",
    items: ["Secure.", "Water level correct.", "No signs of leaking."]
  },
  {
    title: "Air Pre-Cleaner",
    items: [
      "Good condition – no damage/no sucking of air.",
      "Clean and secure.",
      "No dust in pre-cleaner bowl."
    ]
  },
  {
    title: "Fan Belt",
    items: ["No squeaking.", "No signs of damage."]
  },
  {
    title: "Fuel & Oil levels",
    items: [
      "Fuel and oil levels correct.",
      "Fuel cap and hydraulic filler cap secure.",
      "All dipsticks secure."
    ]
  },
  {
    title: "Fuel & Oil Leaks",
    items: [
      "Fuel and oil pipes secure.",
      "No worn or damaged pipes.",
      "No visible fuel and oil leaks."
    ]
  },
  {
    title: "Wiring",
    items: ["No loose, damaged or exposed wires.", "No loose broken plugs."]
  },
  {
    title: "Grease",
    items: ["Adequately greased chassis.", "No missing or damaged grease nipples."]
  },
  {
    title: "Boom Structure",
    items: [
      "Not bent/cracked.",
      "Pins all secured.",
      "No loose/missing bolts."
    ]
  },
  {
    title: "Hydraulic Cylinders",
    items: [
      "Good condition – no damage.",
      "No loose fittings.",
      "No oil leaks.",
      "No missing bolts/nuts."
    ]
  },
  {
    title: "Hydraulic Hoses and Fittings",
    items: [
      "No excessive rubbing.",
      "No loose brackets/bolts/nuts.",
      "Smooth operation.",
      "Jaws not cracked or broken."
    ]
  },
  {
    title: "Harvester Head",
    items: [
      "No pipes leaking/rubbing.",
      "No loose brackets/bolts/nuts.",
      "Roller condition good/smooth operation.",
      "Knives secure/good condition.",
      "Grease hangar link and attachment adequately greased."
    ]
  },
  {
    title: "Cutting Bar & Chain",
    items: [
      "Saw box in good condition.",
      "No wear / adequately lubricated.",
      "Correctly tensioned."
    ]
  },
  {
    title: "Tracks & Sprockets",
    items: [
      "Tracks are aligned.",
      "Not damaged or worn.",
      "No cracks.",
      "No bolts/pins loose or missing."
    ]
  },
  {
    title: "All Excess Loose Debris Removed Pre-Shift",
    items: [
      "Battery area/exhaust area.",
      "Behind the boom/hydraulic cooler.",
      "Engine bay."
    ]
  },
  {
    title: "Escape Hatch & Hammer",
    items: ["Test the escape hatch opening.", "Escape hammer is easily accessible."]
  },
  {
    title: "Communication",
    items: [
      "Radio or cell phone in working condition.",
      "Handheld panic alarm functional."
    ]
  },
  {
    title: "Fire Systems",
    items: [
      "Gauge light working/no warning lights.",
      "No damaged hoses.",
      "Secured/service/seal in place.",
      "Gauges in order."
    ]
  }
]

const allItems = sections.flatMap((section) => section.items)

// --- Helper: renders a grouped section with icon in the MIDDLE (200×200) ---
const renderGroupedSection = (
  title: string,
  items: string[],
  iconSrc: string,
  itemState: Record<string, CheckStatus>,
  onItemChange: (label: string, value: CheckStatus) => void
) => {
  const splitIndex = Math.floor(items.length / 2)
  const firstHalf = items.slice(0, splitIndex)
  const secondHalf = items.slice(splitIndex)

  return (
    <div key={title} className="space-y-2">
      <h4 className="text-sm font-semibold text-primary">{title}</h4>
      <div className="ml-4 rounded-none border border-gray-200 bg-gray-50 p-4 space-y-4">
        {/* First half of items */}
        {firstHalf.map((item) => (
          <div key={item} className="flex items-center justify-between">
            <span className="text-sm text-foreground">{item}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={itemState[item] === "ok" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onItemChange(item, itemState[item] === "ok" ? null : "ok")
                }
                className={`w-16 ${itemState[item] === "ok" ? "bg-green-600 hover:bg-green-700" : ""
                  }`}
              >
                OK
              </Button>
              <Button
                type="button"
                variant={itemState[item] === "def" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onItemChange(item, itemState[item] === "def" ? null : "def")
                }
                className={`w-16 ${itemState[item] === "def" ? "bg-red-600 hover:bg-red-700" : ""
                  }`}
              >
                DEF
              </Button>
              <Button
                type="button"
                variant={itemState[item] === "na" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onItemChange(item, itemState[item] === "na" ? null : "na")
                }
                className={`w-16 ${itemState[item] === "na" ? "bg-gray-600 hover:bg-gray-700" : ""
                  }`}
              >
                N/A
              </Button>
            </div>
          </div>
        ))}

        {/* Icon – BIG, CENTERED (200×200) */}
        <div className="flex justify-center py-6">
          <Image
            src={iconSrc}
            alt={`${title} icon`}
            width={200}
            height={200}
            className="object-contain"
          />
        </div>

        {/* Second half of items */}
        {secondHalf.map((item) => (
          <div key={item} className="flex items-center justify-between">
            <span className="text-sm text-foreground">{item}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={itemState[item] === "ok" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onItemChange(item, itemState[item] === "ok" ? null : "ok")
                }
                className={`w-16 ${itemState[item] === "ok" ? "bg-green-600 hover:bg-green-700" : ""
                  }`}
              >
                OK
              </Button>
              <Button
                type="button"
                variant={itemState[item] === "def" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onItemChange(item, itemState[item] === "def" ? null : "def")
                }
                className={`w-16 ${itemState[item] === "def" ? "bg-red-600 hover:bg-red-700" : ""
                  }`}
              >
                DEF
              </Button>
              <Button
                type="button"
                variant={itemState[item] === "na" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onItemChange(item, itemState[item] === "na" ? null : "na")
                }
                className={`w-16 ${itemState[item] === "na" ? "bg-gray-600 hover:bg-gray-700" : ""
                  }`}
              >
                N/A
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ExcavatorHarvesterForm() {
  const router = useRouter()
  const [pathname, setPathname] = useState("")
  // ---------- Operator Information ----------
  const [formData, setFormData] = useState({
    operatorName: "",
    shift: "",
    date: "",
    hourMeterStart: "",
    hourMeterStop: "",
    validTrainingCard: "",
    unitNumber: ""
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname)
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split("T")[0]
      }))
    }
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionData, setSubmissionData] = useState<any>(null)
  const [automaticNumber, setAutomaticNumber] = useState("")

  // ---------- Auto-generate Document Number ----------
  const documentNo = useMemo(() => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    return `EH-${year}${month}${day}-${random}`
  }, [])

  // ---------- Inspection Items State ----------
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

  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ("touches" in e) {
      const touch = e.touches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      }
    } else {
      return {
        x: e.nativeEvent.offsetX * scaleX,
        y: e.nativeEvent.offsetY * scaleY
      }
    }
  }

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
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

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
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

  // ---------- Computed Values ----------
  const hasDefects = useMemo(
    () => Object.values(items).some((s) => s === "def"),
    [items]
  )
  const allItemsChecked = useMemo(
    () => Object.values(items).every((s) => s !== null),
    [items]
  )
  const checkedCount = useMemo(
    () => Object.values(items).filter((s) => s !== null).length,
    [items]
  )

  const handleItemChange = (label: string, value: CheckStatus) => {
    setItems((prev) => ({ ...prev, [label]: value }))
  }

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
        formType: "excavator-harvester",
        formTitle: "Excavator Harvester Pre-Shift Inspection Checklist",
        submittedBy: formData.operatorName,
        submittedAt: new Date().toISOString(),
        hasDefects,
        data: {
          ...formData,
          documentNo,
          items,
          defectDetails,
          signature: signatureImage,
          automaticNumber: autoNum
        }
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission)
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
          <p className="text-lg text-gray-500">The Excavator Harvester Pre-Shift Inspection has been recorded.</p>
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            asChild
            className="gap-2 text-muted-foreground"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        {/* HEADER */}
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
                Excavator Harvester Pre-Shift Inspection
              </h2>
            </div>

            {/* Right: completion */}
            <div className="flex flex-col items-end">
              <ChecklistStatusBadge completion={Math.round((checkedCount / allItems.length) * 100)} />
              <span className="text-sm text-gray-600 mt-1">{Math.round((checkedCount / allItems.length) * 100)}% Complete</span>
            </div>
          </div>
        </Card>

        {/* GENERAL INSTRUCTIONS */}
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
              Outcome to be detailed with an &quot;Ok&quot; if in order and a &quot;Def&quot; if defective. Defective outcomes
              to be documented below.
            </p>
          </CardContent>
        </Card>

        {/* OPERATOR INFORMATION */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">Operator Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="operatorName" className="text-foreground">
                Operator Name & Surname <span className="text-destructive">*</span>
              </Label>
              <Input
                id="operatorName"
                value={formData.operatorName}
                onChange={(e) => setFormData((p) => ({ ...p, operatorName: e.target.value }))}
                placeholder="Enter operator name"
                required
              />
            </div>

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
              <Label htmlFor="shift" className="text-foreground">Shift</Label>
              <Select
                value={formData.shift}
                onValueChange={(val) => setFormData((p) => ({ ...p, shift: val }))}
              >
                <SelectTrigger id="shift">
                  <SelectValue placeholder="Select shift" />
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
              <Label htmlFor="validTrainingCard" className="text-foreground">
                Valid Training Card (Exp. Date)
              </Label>
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
                placeholder="e.g. EXC-H-001"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* QUICK REFERENCE */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Quick Reference:</h3>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-none bg-green-100 p-2 text-green-700">OK - In order</div>
              <div className="rounded-none bg-red-100 p-2 text-red-700">DEF - Defective</div>
              <div className="rounded-none bg-gray-100 p-2 text-gray-700">N/A - Not applicable</div>
            </div>
          </CardContent>
        </Card>

        {/* PROGRESS */}
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

        {/* INSPECTION ITEMS – ALL 34 SECTIONS GROUPED WITH ICONS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">Inspection Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.map((section, sectionIdx) => {
              // ----- ALL 34 SECTIONS – EVERY SECTION NOW HAS AN ICON IN THE MIDDLE -----
              if (section.title === "License and Phepha") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/license2.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Protective Structure") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/protective-structure.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Exhaust") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/exhaust.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Steps and Rails") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/steps-and-rails.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Cab") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/cabs.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Windscreen, Windows & Wipers") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/wipes.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Air Conditioner") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/air-conditioner.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Seats") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/seats.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Safety Belt") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/safety-belt.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Hooter and Reverse Alarm") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/hooters.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Gauges") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/gauges.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Hydraulic Controls") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/hydraulic-controls.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Air Pre-Cleaner") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/air-pre-cleaner.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Battery") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/battery.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Hydraulic Head Cut Off (Bail Lever)") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/bail-lever.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Fan Belt") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/fan-belt.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Fuel & Oil levels") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/fuel-oil-levels.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Fuel & Oil Leaks") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/fuel-leaks.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Wiring") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/wiring.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Grease") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/grease.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Grill (Sieve)") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/grill.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Working Lights (LED)") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/led.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Radiator") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/radiator.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Rotating Light") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/rotating-light.png",
                  items,
                  handleItemChange
                )
              }

              // ----- NEW FINAL 10 SECTIONS – NOW GROUPED -----
              if (section.title === "Boom Structure") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/boom-structure.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Hydraulic Cylinders") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/hydraulic-cylinders.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Hydraulic Hoses and Fittings") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/hydraulic-hoses.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Harvester Head") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/harvester-head.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Cutting Bar & Chain") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/cutting-bar.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Tracks & Sprockets") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/tracks-sprockets.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "All Excess Loose Debris Removed Pre-Shift") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/all-excess-loose-debris.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Escape Hatch & Hammer") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/escape-hatch.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Communication") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/communication.png",
                  items,
                  handleItemChange
                )
              }
              if (section.title === "Fire Systems") {
                return renderGroupedSection(
                  section.title,
                  section.items,
                  "/images/fire-system.png",
                  items,
                  handleItemChange
                )
              }

              // ----- Fallback (should never be reached) -----
              return (
                <div key={sectionIdx} className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary">{section.title}</h4>
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

        {/* DEFECTS SECTION */}
        {hasDefects && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Defects Detected
              </CardTitle>
              <CardDescription>
                Please provide details for all defects identified above.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={defectDetails}
                onChange={(e) => setDefectDetails(e.target.value)}
                placeholder="Describe the defects in detail..."
                rows={4}
                className="resize-none"
                required={hasDefects}
              />
            </CardContent>
          </Card>
        )}

        {/* SIGNATURE PAD */}
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
                className="w-full max-w-[400px] h-[120px] border rounded-none touch-none cursor-crosshair"
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

        <div className="flex items-center justify-between py-4 border-t border-gray-100 mt-8 pt-8">
          <div className="text-sm font-bold text-gray-900">
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#fbb016] hover:bg-[#e5a014] text-black font-extrabold h-12 px-12 rounded-none"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
