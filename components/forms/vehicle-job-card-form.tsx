"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckCircle2, AlertTriangle, Truck, PenTool, PenLine, User, Clock, Wrench, RefreshCw } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { exportSubmissionToPDF } from "@/lib/export-utils"
import type { Submission } from "@/lib/types"

export default function VehicleJobCardForm() {
  const [formData, setFormData] = useState({
    driversName: "",
    machineVehicle: "",
    date: new Date().toISOString().split("T")[0],
    hourMeterKmReading: "",
    jobCardNo: "2067",
    machineRegistrationNumber: "",
    categoryOfWork: "",
    descriptionOfWorkPerformed: "",
    testPerformedAndResulted: "",
    jobCompletedAndSafeToUse: "",
    mechanicsName: "",
    operatorsName: "",
    mechanicsSignature: "",
    operatorsSignature: "",
    timeOn: "",
    timeOff: "",
    normalTimeHours: "",
    overTimeHours: "",
    totalHours: "0",
    normalTimeKilometers: "",
    overTimeKilometers: "",
    totalKilometers: "0"
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionData, setSubmissionData] = useState<Submission | null>(null)

  const mechanicCanvasRef = useRef<HTMLCanvasElement>(null)
  const operatorCanvasRef = useRef<HTMLCanvasElement>(null)

  const [isDrawingMechanic, setIsDrawingMechanic] = useState(false)
  const [isDrawingOperator, setIsDrawingOperator] = useState(false)

  // Calculations
  useEffect(() => {
    const normal = parseFloat(formData.normalTimeHours) || 0
    const over = parseFloat(formData.overTimeHours) || 0
    setFormData(prev => ({ ...prev, totalHours: (normal + over).toString() }))
  }, [formData.normalTimeHours, formData.overTimeHours])

  useEffect(() => {
    const normal = parseFloat(formData.normalTimeKilometers) || 0
    const over = parseFloat(formData.overTimeKilometers) || 0
    setFormData(prev => ({ ...prev, totalKilometers: (normal + over).toString() }))
  }, [formData.normalTimeKilometers, formData.overTimeKilometers])

  const setupCanvas = (canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 2
        ctx.lineCap = "round"
      }
    }
  }

  useEffect(() => {
    setupCanvas(mechanicCanvasRef.current)
    setupCanvas(operatorCanvasRef.current)
  }, [])

  const startDrawing = (ref: "mechanic" | "operator") => (e: React.MouseEvent | React.TouchEvent) => {
    if (ref === "mechanic") setIsDrawingMechanic(true)
    else setIsDrawingOperator(true)
    draw(ref)(e)
  }

  const stopDrawing = (ref: "mechanic" | "operator") => () => {
    if (ref === "mechanic") {
      setIsDrawingMechanic(false)
      if (mechanicCanvasRef.current) {
        setFormData(prev => ({ ...prev, mechanicsSignature: mechanicCanvasRef.current!.toDataURL() }))
      }
    } else {
      setIsDrawingOperator(false)
      if (operatorCanvasRef.current) {
        setFormData(prev => ({ ...prev, operatorsSignature: operatorCanvasRef.current!.toDataURL() }))
      }
    }
  }

  const draw = (ref: "mechanic" | "operator") => (e: React.MouseEvent | React.TouchEvent) => {
    const isDrawing = ref === "mechanic" ? isDrawingMechanic : isDrawingOperator
    if (!isDrawing) return

    const canvas = ref === "mechanic" ? mechanicCanvasRef.current : operatorCanvasRef.current
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

  const clearSignature = (ref: "mechanic" | "operator") => {
    const canvas = ref === "mechanic" ? mechanicCanvasRef.current : operatorCanvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (ref === "mechanic") setFormData(prev => ({ ...prev, mechanicsSignature: "" }))
      else setFormData(prev => ({ ...prev, operatorsSignature: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.mechanicsSignature || !formData.operatorsSignature) {
      toast.error("Both Mechanic and Operator signatures are required.")
      return
    }

    const submission: Submission = {
      id: Math.random().toString(36).substring(2, 9),
      formType: "vehicle-job-card",
      submittedAt: new Date().toISOString(),
      submittedBy: formData.mechanicsName || "Mechanic",
      data: formData
    }

    const existing = JSON.parse(localStorage.getItem("form_submissions") || "[]")
    localStorage.setItem("form_submissions", JSON.stringify([...existing, submission]))

    setSubmissionData(submission)
    setIsSubmitted(true)
    toast.success("Job Card submitted successfully!")
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
              The Motorized Equipment/Vehicle Job Card has been recorded.
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
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 shadow-sm ring-1 ring-gray-200">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-between gap-6 border-b border-gray-100 pb-8 md:flex-row">
          <div className="relative h-24 w-56">
            <Image src="/images/ringomode-logo.png" alt="Ringomode Logo" fill className="object-contain" priority />
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-2xl font-bold tracking-tight text-[#4e8c31] lg:text-3xl">
              HSE Management System
            </h1>
            <h2 className="text-xl font-bold text-[#4e8c31]">
              Motorized Equipment/Vehicle Job Card
            </h2>
          </div>
        </div>

        {/* Top Info Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Drivers Name</Label>
            <Select onValueChange={value => setFormData(prev => ({ ...prev, driversName: value }))}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Driver A">Driver A</SelectItem>
                <SelectItem value="Driver B">Driver B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Machine/Vehicle</Label>
            <Input
              required
              value={formData.machineVehicle}
              onChange={e => setFormData(prev => ({ ...prev, machineVehicle: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Date</Label>
            <Input
              required
              type="date"
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Hour Meter/ KM Reading</Label>
            <Input
              required
              value={formData.hourMeterKmReading}
              onChange={e => setFormData(prev => ({ ...prev, hourMeterKmReading: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Job Card No.</Label>
            <div className="font-bold text-gray-900 px-3 py-2 bg-gray-50 border border-gray-200">{formData.jobCardNo}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Machine/Registration Number</Label>
            <Input
              required
              value={formData.machineRegistrationNumber}
              onChange={e => setFormData(prev => ({ ...prev, machineRegistrationNumber: e.target.value }))}
            />
          </div>
        </div>

        {/* Category of Work */}
        <div className="space-y-4 pt-4">
          <Label className="text-sm font-bold text-gray-700">Category of Work</Label>
          <div className="flex flex-wrap gap-8">
            {["Service", "Breakdown", "MCA", "Other"].map(cat => (
              <div key={cat} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="categoryOfWork"
                  id={cat}
                  value={cat}
                  checked={formData.categoryOfWork === cat}
                  onChange={e => setFormData(prev => ({ ...prev, categoryOfWork: e.target.value }))}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <label htmlFor={cat} className="text-sm font-medium text-gray-700">{cat}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Description & Results */}
        <div className="space-y-6 border-t border-gray-200 pt-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Description of Work Performed:</Label>
            <Textarea
              className="min-h-[120px] resize-none border-gray-300"
              value={formData.descriptionOfWorkPerformed}
              onChange={e => setFormData(prev => ({ ...prev, descriptionOfWorkPerformed: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Test Performed and Resulted</Label>
            <Textarea
              className="min-h-[120px] resize-none border-gray-300"
              value={formData.testPerformedAndResulted}
              onChange={e => setFormData(prev => ({ ...prev, testPerformedAndResulted: e.target.value }))}
            />
          </div>
        </div>

        {/* Safe to use */}
        <div className="space-y-2 border-t border-gray-200 pt-6">
          <Label className="text-sm font-bold text-gray-700">Job completed and safe to use</Label>
          <Select onValueChange={value => setFormData(prev => ({ ...prev, jobCompletedAndSafeToUse: value }))}>
            <SelectTrigger className="w-full md:w-64 bg-white">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Names & Signatures Grid */}
        <div className="grid gap-8 border-t border-gray-200 pt-6 md:grid-cols-2">
          {/* Mechanic */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Mechanics Name</Label>
              <Input
                required
                value={formData.mechanicsName}
                onChange={e => setFormData(prev => ({ ...prev, mechanicsName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Mechanics Signature</Label>
              <Card className="overflow-hidden border-gray-300">
                <CardContent className="p-0">
                  <canvas
                    ref={mechanicCanvasRef}
                    width={400}
                    height={150}
                    className="h-32 w-full cursor-crosshair touch-none bg-white"
                    onMouseDown={startDrawing("mechanic")}
                    onMouseUp={stopDrawing("mechanic")}
                    onMouseOut={stopDrawing("mechanic")}
                    onMouseMove={draw("mechanic")}
                    onTouchStart={startDrawing("mechanic")}
                    onTouchEnd={stopDrawing("mechanic")}
                    onTouchMove={draw("mechanic")}
                  />
                  <div className="flex justify-end gap-2 border-t bg-gray-50 p-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => clearSignature("mechanic")}>Clear</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Operator */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Operators Name</Label>
              <Input
                required
                value={formData.operatorsName}
                onChange={e => setFormData(prev => ({ ...prev, operatorsName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Operators Signature</Label>
              <Card className="overflow-hidden border-gray-300">
                <CardContent className="p-0">
                  <canvas
                    ref={operatorCanvasRef}
                    width={400}
                    height={150}
                    className="h-32 w-full cursor-crosshair touch-none bg-white"
                    onMouseDown={startDrawing("operator")}
                    onMouseUp={stopDrawing("operator")}
                    onMouseOut={stopDrawing("operator")}
                    onMouseMove={draw("operator")}
                    onTouchStart={startDrawing("operator")}
                    onTouchEnd={stopDrawing("operator")}
                    onTouchMove={draw("operator")}
                  />
                  <div className="flex justify-end gap-2 border-t bg-gray-50 p-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => clearSignature("operator")}>Clear</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* MECHANICS JOB CARD SECTION */}
        <div className="border-t border-gray-200 pt-6 space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#4e8c31] underline">MECHANICS JOB CARD</h2>
          </div>

          {/* TIME */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-bold text-[#4e8c31] underline">TIME</h3>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="space-y-2 text-left">
                <Label className="text-sm font-bold text-gray-700">Time On</Label>
                <Input value={formData.timeOn} onChange={e => setFormData(prev => ({ ...prev, timeOn: e.target.value }))} />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-sm font-bold text-gray-700">Time Off</Label>
                <Input value={formData.timeOff} onChange={e => setFormData(prev => ({ ...prev, timeOff: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* LABOUR */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-bold text-[#4e8c31] underline">LABOUR</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 text-left">
                <Label className="text-sm font-bold text-gray-700">Normal Time Hours</Label>
                <Input type="number" step="0.5" value={formData.normalTimeHours} onChange={e => setFormData(prev => ({ ...prev, normalTimeHours: e.target.value }))} />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-sm font-bold text-gray-700">Over Time Hours</Label>
                <Input type="number" step="0.5" value={formData.overTimeHours} onChange={e => setFormData(prev => ({ ...prev, overTimeHours: e.target.value }))} />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-sm font-bold text-gray-700">Total Hours</Label>
                <div className="px-3 py-2 bg-gray-100 border border-gray-200 font-mono text-sm">{formData.totalHours}</div>
              </div>
            </div>
          </div>

          {/* TRAVEL */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-bold text-[#4e8c31] underline">TRAVEL</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 text-left">
                <Label className="text-sm font-bold text-gray-700">Normal Time Kilometers</Label>
                <Input type="number" value={formData.normalTimeKilometers} onChange={e => setFormData(prev => ({ ...prev, normalTimeKilometers: e.target.value }))} />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-sm font-bold text-gray-700">Over Time Kilometers</Label>
                <Input type="number" value={formData.overTimeKilometers} onChange={e => setFormData(prev => ({ ...prev, overTimeKilometers: e.target.value }))} />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-sm font-bold text-gray-700">Total Kilometers</Label>
                <div className="px-3 py-2 bg-gray-100 border border-gray-200 font-mono text-sm">{formData.totalKilometers}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-8 border-t border-gray-200">
          {[
            { label: "Document Reference No.", value: "HSEMS / 8.1.19 / DOC / 00" },
            { label: "Author", value: "HSE-MANAGER" },
            { label: "Revision", value: "3" },
            { label: "Creation Date", value: "04/20/2020" },
          ].map(meta => (
            <div key={meta.label} className="bg-gray-50 p-3 border border-gray-200">
              <Label className="text-[10px] font-bold text-gray-900 uppercase">{meta.label}</Label>
              <div className="text-xs text-gray-500 mt-1">{meta.value}</div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" className="h-12 w-48 bg-[#fbb016] hover:bg-[#e5a014] text-black font-bold text-lg rounded-none">
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}
