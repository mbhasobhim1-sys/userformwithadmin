"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardCheck, CheckCircle2, AlertTriangle, Info, Calendar, User, Truck, PenTool, PenLine } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { exportSubmissionToPDF } from "@/lib/export-utils"
import type { Submission, CheckStatus } from "@/lib/types"

const statusOptions = ["OK", "Defective", "N/A"]

const sections = [
  {
    title: "General Maintenance",
    items: [
      "Walk Around Inspection",
      "Check Fluid Levels",
      "Check for Leaks",
      "Check Tyres",
      "Check Lights & Reflectors",
      "Check Brakes",
      "Check Coupling & Safety Chains",
      "Check Load Security",
      "Check Safety Decals",
      "Check for Damage",
      "Check Grease Points",
      "Check Hydraulic Hoses",
      "Check Battery",
      "Check Air Filter",
      "Check Radiator",
      "Check Fan Belts",
      "Check Suspension",
      "Check Axles",
      "Check Floor & Deck"
    ]
  }
]

export default function WaterCartTrailerPressureWasherForm() {
  const [formData, setFormData] = useState({
    operatorName: "",
    documentNo: "",
    date: new Date().toISOString().split("T")[0],
    unitNumber: "",
    hourMeterStart: "",
    hourMeterStop: "",
    validTrainingCard: "",
    items: {} as Record<string, CheckStatus>,
    defectDetails: "",
    signature: ""
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionData, setSubmissionData] = useState<Submission | null>(null)
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
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      setFormData(prev => ({ ...prev, signature: canvas.toDataURL() }))
    }
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
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setFormData(prev => ({ ...prev, signature: "" }))
    }
  }

  const handleStatusChange = (item: string, status: string) => {
    const checkStatus = status.toLowerCase() === "ok" ? "ok" : status.toLowerCase() === "defective" ? "def" : "na"
    setFormData(prev => ({
      ...prev,
      items: { ...prev.items, [item]: checkStatus as CheckStatus }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if signature is present
    if (!formData.signature) {
      toast.error("Please provide a signature before submitting.")
      return
    }

    const submission: Submission = {
      id: Math.random().toString(36).substring(2, 9),
      formType: "water-cart-trailer-pressure-washer",
      submittedAt: new Date().toISOString(),
      submittedBy: formData.operatorName,
      data: {
        ...formData,
        hasDefects: Object.values(formData.items).some(v => v === "def")
      }
    }

    // Save to local storage for persistence
    const existing = JSON.parse(localStorage.getItem("form_submissions") || "[]")
    localStorage.setItem("form_submissions", JSON.stringify([...existing, submission]))

    setSubmissionData(submission)
    setIsSubmitted(true)
    toast.success("Inspection submitted successfully!")
  }

  if (isSubmitted && submissionData) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Submission Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your inspection for Water Cart Trailer & Pressure Washer has been recorded.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => exportSubmissionToPDF(submissionData)}
                className="w-full gap-2 bg-primary hover:bg-primary/90"
              >
                <Image src="/images/pdf-icon.png" alt="PDF" width={20} height={20} className="invert brightness-0" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/"} className="w-full">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl p-4 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-between gap-6 border-b border-gray-100 pb-8 md:flex-row">
          <div className="relative h-20 w-44">
            <Image src="/images/ringomode-logo.png" alt="Ringomode Logo" fill className="object-contain" priority />
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">
              Water Cart Trailer & Pressure Washer
            </h1>
            <p className="text-sm font-medium text-primary">HSE Management System</p>
          </div>
        </div>

        {/* Metadata Grid */}
        <Card className="overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
          <CardContent className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Operator Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  placeholder="Enter name"
                  className="pl-10"
                  value={formData.operatorName}
                  onChange={e => setFormData(prev => ({ ...prev, operatorName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="date"
                  className="pl-10"
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unit Number</Label>
              <div className="relative">
                <Truck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  placeholder="e.g. WC-01"
                  className="pl-10"
                  value={formData.unitNumber}
                  onChange={e => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspection Sections */}
        {sections.map(section => (
          <div key={section.title} className="space-y-4">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map(item => (
                <Card key={item} className="border-gray-100 bg-gray-50/30 transition-shadow hover:shadow-sm">
                  <CardContent className="p-4">
                    <Label className="mb-3 block text-sm font-medium leading-tight text-gray-700">{item}</Label>
                    <Select onValueChange={value => handleStatusChange(item, value)} required>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option} value={option}>
                            <div className="flex items-center gap-2">
                              {option === "OK" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                              {option === "Defective" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                              {option === "N/A" && <Info className="h-4 w-4 text-gray-400" />}
                              {option}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Defects Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Defect Details</h2>
          </div>
          <Card>
            <CardContent className="p-4">
              <Textarea
                placeholder="Please provide details of any defects found during inspection..."
                className="min-h-[120px] resize-none"
                value={formData.defectDetails}
                onChange={e => setFormData(prev => ({ ...prev, defectDetails: e.target.value }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Footer & Signature */}
        <div className="grid gap-6 border-t border-gray-100 pt-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <PenLine className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-gray-900">Operator Signature</h2>
            </div>
            <Card className="overflow-hidden bg-gray-50">
              <CardContent className="p-0">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  className="h-48 w-full cursor-crosshair touch-none bg-white"
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                />
                <div className="flex justify-end border-t bg-gray-50 p-2">
                  <Button type="button" variant="ghost" size="sm" onClick={clearSignature} className="text-destructive hover:bg-destructive/10">
                    Clear Signature
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col justify-end gap-4">
            <Button type="submit" size="lg" className="h-14 w-full gap-2 text-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0">
              Submit Inspection Report
              <PenTool className="h-5 w-5" />
            </Button>
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="font-mono text-[10px] text-muted-foreground">
                DOC REF: HSEMS/8.1.19/REG/015 | REV 2 | 2024
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
