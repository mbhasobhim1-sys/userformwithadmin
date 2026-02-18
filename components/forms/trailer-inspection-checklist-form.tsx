"use client"

import React, { useRef, useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type CheckStatus, trailerExclLabourItems } from "@/lib/types"
import { CheckCircle2, ArrowLeft, AlertCircle, Calendar, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportSubmissionToPDF } from "@/lib/export-utils" // Import export function

interface Section {
  title: string
  items: string[]
  danger?: "skull" | "warning"
}

const sections: Section[] = [
  { title: "License and Phepha", items: ["Phepha valid", "Displayed and visible"] },
  { title: "Number Plate", items: ["Number plate in place", "Clean & visible"] },
  { title: "Trailer Body", items: ["No damage", "No rust", "Structure secure"] },
  { title: "Trailer Doors/Opening Flaps", items: ["Opening flaps secure", "Locks/latches working"] },
  { title: "Steps and Rails", items: ["No damage", "No bolts missing/loose", "Secure"] },
  { title: "Chevron, Reflectors and Tape", items: ["Clean & visible", "No damage", "Secured"] },
  { title: "Working Lights", items: ["In working order", "Indicators", "Brake lights", "Tail lights"] },
  { title: "Trailer Plug/Electric Wiring & Connectors", items: ["Connectors working", "No exposed wires"] },
  { title: "Hand Brake/ Brake Cable", items: ["Working and secure"] },
  { title: "U-Bolts", items: ["Secure", "No missing nuts"] },
  { title: "Grease", items: ["Adequately greased", "Grease nipples intact"] },
  { title: "Tyres", items: ["No wear and tear", "Thread depth in order", "No cuts"] },
  { title: "Wheel Rims", items: ["Not damaged", "No cracks"] },
  { title: "Wheel Nuts", items: ["Wheel nuts secure", "None missing"] },
  { title: "Mud Flaps", items: ["In place", "Secure"] },
  { title: "Drawbar", items: ["Drawbar and eye in good condition", "Drawbar bolts in place and secure", "No metal fatigue"], danger: "skull" },
  { title: "Safety Chain", items: ["In place", "Good condition", "Not damaged and secured"], danger: "skull" },
  { title: "Jockey Wheel", items: ["Jockey wheel in good condition", "No signs of rust", "Adequately secured to trailer", "Correct rating (GCM) for the trailer"], danger: "skull" },
  { title: "Land Gear, Wooden Stands Not Permitted", items: ["Adequate for the tare & GVM of trailer", "Base plate in place", "No damage or rust"], danger: "skull" },
  { title: "Chocks", items: ["2 x chocks available", "In good condition"], danger: "warning" },
  { title: "Emergency Triangles", items: ["2 x available as per legal requirements", "In good condition"], danger: "skull" },
  { title: "Fire Extinguisher (1 x 9kg extinguisher)", items: ["In working order", "Serviced", "Gauge in order", "Seal in place"], danger: "skull" },
] as { title: string; items: string[]; danger?: "skull" | "warning" }[]

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
          <div className="w-[208px] h-[151px] relative flex items-center justify-center p-2 bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image src={iconSrc} alt={`${title} icon`} width={200} height={145} className="object-contain relative z-10" />
            </div>
          </div>

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
        <div className="w-full md:w-40 bg-gray-50 p-4 rounded-none border border-gray-200">
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

export default function TrailerExclLabourInspectionChecklistForm() {
  const router = useRouter()
  const [pathname, setPathname] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname)
    }
  }, [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [documentNo, setDocumentNo] = useState("")
  const [automaticNumber, setAutomaticNumber] = useState("")

  const [formData, setFormData] = useState({
    userName: "",
    registrationNumber: "",
    date: "",
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
    setDocumentNo(`TRL-${year}${month}${day}-${random}`)

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
      setDrawingHistory(prev => [...prev.slice(-19), dataUrl])
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
  const allItemsChecked = useMemo(() => {
    // Check if at least one item from each section is checked (since sections are grouped)
    return sections.every(section => items[section.items[0]] !== null)
  }, [items])

  const [submitted, setSubmitted] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userName || !formData.registrationNumber) {
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
      const autoNum = Math.floor(2000 + Math.random() * 9000).toString()
      setAutomaticNumber(autoNum)

      const submissionData = {
        ...formData,
        documentNo,
        items,
        hasDefects,
        defectDetails,
        signature: signatureImage,
        automaticNumber: autoNum
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "trailer-excl-labour",
          formTitle: "Trailer (Excluding Labour) Inspection Checklist",
          submittedBy: formData.userName,
          hasDefects,
          data: submissionData,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success("Checklist submitted successfully!")
        setSubmissionId(result.id)
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
      formType: "trailer-excl-labour",
      submittedBy: formData.userName,
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
        <Card className="border-emerald-200 bg-emerald-50 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Submission Complete!</h1>
          <p className="text-emerald-700 mb-8">
            The Trailer Inspection has been recorded successfully.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 text-lg gap-2" onClick={handleDownload}>
              <Info className="h-5 w-5" /> Download Form (PDF)
            </Button>
            <Button size="lg" variant="outline" className="w-full border-emerald-200 h-14 text-lg gap-2" onClick={() => (window.location.href = "/")}>
              <ArrowLeft className="h-5 w-5" /> Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20 p-6 md:p-10 bg-white shadow-xl rounded-none my-8">
      <form onSubmit={handleSubmit} className="space-y-6 p-4 pb-12 lg:p-0 lg:pb-0">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </Button>
        </div>

        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-shrink-0">
              <Image src="/images/ringomode-logo.png" alt="Ringomode Logo" width={180} height={60} className="object-contain" />
            </div>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-blue-800 leading-tight">HSE Management System</h1>
              <h2 className="text-2xl font-bold text-blue-700 underline decoration-blue-200 underline-offset-8 mt-2 max-w-xl mx-auto">
                Trailer (Excluding Labour) Inspection Checklist
              </h2>
            </div>
            <div className="flex flex-col items-center md:items-end flex-shrink-0">
              <span className="text-sm font-bold text-blue-700">
                {Math.round((Object.values(items).filter((v) => v !== null).length / allItems.length) * 100)}% Complete
              </span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>User's Name</Label>
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

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-sm font-semibold text-amber-800">General Instructions:</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700">
              The user is to conduct a 10 minute physical walkabout of the trailer on a daily basis and assess the condition.
              Outcome to be detailed with an "Ok" if in order and a "Def" if defective.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-none bg-green-100 p-2 text-green-700 font-bold uppercase tracking-wider">OK - In order</div>
              <div className="rounded-none bg-red-100 p-2 text-red-700 font-bold uppercase tracking-wider">DEF - Defective</div>
              <div className="rounded-none bg-gray-100 p-2 text-gray-700 font-bold uppercase tracking-wider">N/A - Not applicable</div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-2 border-gray-100 shadow-xl bg-white">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="text-lg font-black text-gray-900 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              INSPECTION ITEMS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {sections.map((section) => {
                const iconMap: Record<string, string> = {
                  "License and Phepha": "license2.png",
                  "Number Plate": "trailer-number-plate.png",
                  "Trailer Body": "trailer-body.png",
                  "Trailer Doors/Opening Flaps": "trailer-doors.png",
                  "Steps and Rails": "steps-and-rails.png",
                  "Chevron, Reflectors and Tape": "chevron-reflectors.png",
                  "Working Lights": "led.png",
                  "Trailer Plug/Electric Wiring & Connectors": "wiring.png",
                  "Hand Brake/ Brake Cable": "excavator-loader-brakes-steering.png",
                  "U-Bolts": "trailer-u-bolts.png",
                  "Grease": "grease.png",
                  "Tyres": "excavator-loader-wheels-tyres.png",
                  "Wheel Rims": "excavator-loader-wheels-tyres.png",
                  "Wheel Nuts": "excavator-loader-wheels-tyres.png",
                  "Mud Flaps": "trailer-mud-flaps.png",
                  "Drawbar": "trailer-drawbar.png",
                  "Safety Chain": "trailer-safety-chain.png",
                  "Jockey Wheel": "trailer-jockey-wheel.png",
                  "Land Gear, Wooden Stands Not Permitted": "trailer-land-gear.png",
                  "Chocks": "chocks.png",
                  "Emergency Triangles": "emergency-triangles.png",
                  "Fire Extinguisher (1 x 9kg extinguisher)": "fire-system.png",
                }

                const secondIconSrc = section.danger === "skull"
                  ? "/images/skull.png"
                  : section.danger === "warning"
                    ? "/images/warning-triangle.png"
                    : section.title === "License and Phepha"
                      ? "/images/phepha-valid.png"
                      : null;

                return (
                  <div key={section.title} className="p-6 bg-white">
                    {renderGroupedSection(
                      section.title,
                      section.items,
                      `/images/${iconMap[section.title] || "ringomode-logo.png"}`,
                      secondIconSrc,
                      items,
                      handleItemChange
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 pt-10 border-t-2 border-gray-300">
          <div>
            <Label className="text-sm font-bold block mb-2">Are There Any Defects Selected?</Label>
            <div className={hasDefects ? "text-red-600 font-bold" : "text-gray-600"}>
              {hasDefects ? "YES" : "NO"}
            </div>
          </div>

          <div>
            <Label className="text-sm font-bold block mb-2">Details of Defects (If "Def" is selected, please specify defects here)</Label>
            <Textarea value={defectDetails} onChange={(e) => setDefectDetails(e.target.value)} rows={4} className="border-gray-300 bg-white" />
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
                width={378}
                height={189}
                className="w-[378px] h-[189px] cursor-crosshair bg-white"
              />
              <div className="mt-2 flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={clearSignature} className="border-gray-400 bg-gray-50 font-bold">Clear</Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-gray-100 mt-8 pt-8">
            <div className="text-sm font-bold text-gray-900">
              Automatic Number: <span className="text-gray-400 italic">Generated on Submit</span>
            </div>
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="h-12 px-8 font-bold rounded-none" onClick={() => (window.location.href = "/")}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#fbb016] hover:bg-[#e5a014] text-black font-extrabold h-12 px-12 rounded-none">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
