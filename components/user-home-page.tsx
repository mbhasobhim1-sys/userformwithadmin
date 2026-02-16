"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Truck, 
  Tractor, 
  TreePine, 
  Container, 
  Wrench, 
  ArrowRight, 
  ClipboardList
} from "lucide-react"

const forms = [
  {
    id: "daily-attachment-checklist",
    title: "Daily Attachment Checklist",
    subtitle: "Mechanical Inspection",
    description: "Daily inspection for harvester head attachments, hydraulics, cylinders, and related mechanical systems.",
    icon: Wrench,
    href: "/daily-attachment-checklist",
    docRef: "HSEMS/8.1.19/REG/025",
    itemCount: 23,
  },
  {
    id: "light-delivery",
    title: "Light Delivery Vehicle",
    subtitle: "Daily Checklist",
    description: "Pre-trip inspection for light delivery vehicles including checks for tyres, brakes, lights, and safety equipment.",
    icon: Truck,
    href: "/light-delivery",
    docRef: "HSEMS/8.1.19/REG/012",
    itemCount: 26,
  },
  {
    id: "excavator-loader",
    title: "Excavator Loader",
    subtitle: "Pre-Shift Inspection",
    description: "Comprehensive pre-shift inspection for excavator loaders covering hydraulics, tracks, controls, and safety systems.",
    icon: Tractor,
    href: "/excavator-loader",
    docRef: "HSEMS/8.1.19/REG/002",
    itemCount: 33,
  },
  {
    id: "excavator-harvester",
    title: "Excavator Harvester",
    subtitle: "Pre-Shift Inspection",
    description: "Pre-shift inspection for excavator harvesters including harvester head, feed rollers, delimbing knives, and safety checks.",
    icon: TreePine,
    href: "/excavator-harvester",
    docRef: "HSEMS/8.1.19/REG/001",
    itemCount: 36,
  },
  {
    id: "lowbed-trailer",
    title: "Lowbed & Roll Back Trailer",
    subtitle: "Pre-Shift Inspection",
    description: "Complete inspection for lowbed and roll back trailers including deck condition, hydraulics, winch, tyres, and coupling systems.",
    icon: Container,
    href: "/lowbed-trailer",
    docRef: "HSEMS/8.1.19/REG/020",
    itemCount: 29,
  },
  {
    id: "mechanic-ldv",
    title: "Mechanic LDV",
    subtitle: "Daily Checklist",
    description: "Specialized daily inspection for mechanic light delivery vehicles covering tools, equipment, and vehicle systems.",
    icon: Wrench,
    href: "/mechanic-ldv",
    docRef: "HSEMS/8.1.19/REG/017",
    itemCount: 24,
  },
]

export function UserHomePage() {
  return (
    <main className="mx-auto max-w-7xl p-4 lg:p-8">
        {/* Hero Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4">
            <Image src="/images/ringomode-logo.png" alt="Ringomode DSP logo" width={180} height={60} className="object-contain" />
          </div>
          <h1 className="text-balance text-2xl font-bold text-foreground lg:text-3xl">
            HSE Inspection Checklists
          </h1>
          <p className="mt-2 max-w-xl text-pretty text-muted-foreground">
            Select a checklist below to begin your pre-shift or daily inspection. All submissions are recorded and reviewed by the HSE team.
          </p>
        </div>

        {/* Stats - Single card: Available Forms */}
        <div className="mb-8 flex justify-center">
          <Card className="text-center w-full max-w-xs">
            <CardContent className="pt-6">
              <ClipboardList className="mx-auto mb-2 h-6 w-6 text-primary" />
              <div className="text-2xl font-bold text-foreground">{forms.length}</div>
              <div className="text-xs text-muted-foreground">Available Forms</div>
            </CardContent>
          </Card>
        </div>

        {/* Form Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {forms.map((form) => {
            const Icon = form.icon
            return (
              <Card
                key={form.id}
                className="group relative overflow-hidden transition-all hover:border-primary/30 hover:shadow-md flex flex-col h-full"
              >
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-foreground">{form.title}</CardTitle>
                  <CardDescription className="text-xs font-medium uppercase tracking-wide text-primary">
                    {form.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <p className="text-sm text-muted-foreground flex-grow">{form.description}</p>
                  
                  {/* Document Reference & Item Count */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{form.itemCount} inspection items</span>
                    <span className="font-mono">{form.docRef}</span>
                  </div>

                  {/* Start Inspection Button */}
                  <Button asChild className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                    <Link href={form.href}>
                      Start Inspection
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <p className="text-xs font-medium text-blue-700">Light Delivery</p>
            <p className="text-lg font-bold text-blue-800">26 items</p>
          </div>
          <div className="rounded-lg bg-orange-50 p-3 text-center">
            <p className="text-xs font-medium text-orange-700">Excavator Loader</p>
            <p className="text-lg font-bold text-orange-800">33 items</p>
          </div>
          <div className="rounded-lg bg-green-50 p-3 text-center">
            <p className="text-xs font-medium text-green-700">Excavator Harvester</p>
            <p className="text-lg font-bold text-green-800">36 items</p>
          </div>
          <div className="rounded-lg bg-purple-50 p-3 text-center">
            <p className="text-xs font-medium text-purple-700">Lowbed Trailer</p>
            <p className="text-lg font-bold text-purple-800">29 items</p>
          </div>
          <div className="rounded-lg bg-red-50 p-3 text-center">
            <p className="text-xs font-medium text-red-700">Mechanic LDV</p>
            <p className="text-lg font-bold text-red-800">24 items</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>Ringomode HSE Management System</p>
          <p className="mt-1">All inspections are logged and reviewed by the HSE Manager.</p>
          <p className="mt-2 text-[10px]">Document Control: HSEMS/8.1.19/REG | Rev. 2 | 27.03.2024</p>
        </footer>
      </main>
  )
}