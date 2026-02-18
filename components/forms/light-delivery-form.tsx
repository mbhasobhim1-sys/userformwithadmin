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
import { ChecklistRadioGroup } from "@/components/checklist-radio-group"
import { ChecklistStatusBadge } from "@/components/checklist-status-badge"
import { lightDeliveryItems, type CheckStatus } from "@/lib/types"
import { AlertTriangle, CheckCircle2, Send, ArrowLeft, AlertCircle, Eraser, FileText } from "lucide-react"
import { exportSubmissionToPDF } from "@/lib/export-utils"
import Link from "next/link"
import Image from "next/image"

export function LightDeliveryForm() {
  const router = useRouter()
  const [pathname, setPathname] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname)
    }
  }, [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionData, setSubmissionData] = useState<any>(null)
  const [automaticNumber, setAutomaticNumber] = useState("")

  // ---------- Driver Information ----------
  const [formData, setFormData] = useState({
    driverName: "",
    vehicleRegistration: "",
    date: new Date().toISOString().split("T")[0],
    validTrainingCard: "",
    driversLicenseAvailable: "",
    odometerStart: "",
    odometerStop: "",
  })

  // ---------- Auto-generate Document Number ----------
  const documentNo = useMemo(() => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    return `LD-${year}${month}${day}-${random}`
  }, [])

  // ---------- Inspection Items ----------
  const [items, setItems] = useState<Record<string, CheckStatus>>(
    Object.fromEntries(lightDeliveryItems.map((item) => [item, null]))
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

    if (!formData.driverName || !formData.vehicleRegistration) {
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
        formType: "light-delivery",
        formTitle: "Light Delivery Vehicle Daily Checklist",
        submittedBy: formData.driverName,
        submittedAt: new Date().toISOString(),
        hasDefects,
        data: {
          ...formData,
          documentNo,
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
          <p className="text-lg text-gray-500">The Light Delivery Vehicle Daily Checklist has been recorded.</p>
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
                Light Delivery Vehicle Daily Checklist
              </h2>
            </div>

            {/* Right: completion */}
            <div className="flex flex-col items-end">
              <ChecklistStatusBadge completion={Math.round((checkedCount / lightDeliveryItems.length) * 100)} />
              <span className="text-sm text-gray-600 mt-1">{Math.round((checkedCount / lightDeliveryItems.length) * 100)}% Complete</span>
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
              The driver is to conduct a 10 minute physical walkabout of the vehicle on a daily basis
              and assess the condition of the vehicle.
            </p>
            <p className="mt-2 text-sm text-amber-700">
              Outcome to be detailed with an "Ok" if in order and a "Def" if defective. Defective outcomes
              to be documented below.
            </p>
          </CardContent>
        </Card>

        {/* ===== DRIVER INFORMATION ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">Driver Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="driverName" className="text-foreground">
                Driver's Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="driverName"
                value={formData.driverName}
                onChange={(e) => setFormData((p) => ({ ...p, driverName: e.target.value }))}
                placeholder="Enter driver name"
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
              <Label htmlFor="vehicleRegistration" className="text-foreground">
                Vehicle Registration <span className="text-destructive">*</span>
              </Label>
              <Input
                id="vehicleRegistration"
                value={formData.vehicleRegistration}
                onChange={(e) => setFormData((p) => ({ ...p, vehicleRegistration: e.target.value }))}
                placeholder="e.g. ABC 123 GP"
                required
              />
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
              <Label htmlFor="validTrainingCard" className="text-foreground">Valid Training Card (Exp. Date)</Label>
              <Input
                id="validTrainingCard"
                type="date"
                value={formData.validTrainingCard}
                onChange={(e) => setFormData((p) => ({ ...p, validTrainingCard: e.target.value }))}
              />
            </div>

            {/* ===== DRIVER'S LICENSE FIELD WITH ICON ===== */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/license2.png"
                  alt="Driver License Icon"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <Label htmlFor="driversLicense" className="text-foreground">
                  Driver's License Available (Exp. Date)
                </Label>
              </div>
              <Input
                id="driversLicense"
                type="date"
                value={formData.driversLicenseAvailable}
                onChange={(e) => setFormData((p) => ({ ...p, driversLicenseAvailable: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="odometerStart" className="text-foreground">Odometer Start</Label>
              <Input
                id="odometerStart"
                type="number"
                value={formData.odometerStart}
                onChange={(e) => setFormData((p) => ({ ...p, odometerStart: e.target.value }))}
                placeholder="e.g. 45000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="odometerStop" className="text-foreground">Odometer Stop</Label>
              <Input
                id="odometerStop"
                type="number"
                value={formData.odometerStop}
                onChange={(e) => setFormData((p) => ({ ...p, odometerStop: e.target.value }))}
                placeholder="e.g. 45150"
              />
            </div>
          </CardContent>
        </Card>

        {/* ===== QUICK REFERENCE ===== */}
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

        {/* ===== PROGRESS ===== */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Progress: {checkedCount} / {lightDeliveryItems.length} items checked
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
            style={{ width: `${(checkedCount / lightDeliveryItems.length) * 100}%` }}
          />
        </div>

        {/* ===== INSPECTION ITEMS ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">Inspection Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lightDeliveryItems.map((item, idx) => (
              <ChecklistRadioGroup
                key={item}
                label={item}
                value={items[item]}
                onChange={(val) => handleItemChange(item, val)}
                index={idx}
              />
            ))}
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

