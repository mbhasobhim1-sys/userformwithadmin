import type { Submission, CheckStatus } from "@/lib/types"

// ============================================================================
// SECTIONS ARRAY – EXACTLY THE SAME AS YOUR WEB FORM (34 sections)
// ============================================================================
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

// Sections specifically for Skidder Pre-Shift Inspection
const skidderSections = [
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
]

// Sections specifically for Excavator Loader (used by PDF export)
const loaderSections = [
  { title: "Fire & Safety Equipment", items: ["Fire extinguisher (serviced/sealed)", "First aid kit"] },
  { title: "Operator Environment", items: ["Seat belt", "Mirrors", "Lights (head/tail/work)", "Horn / reverse alarm", "Windscreen / wipers", "Steps / handrails", "Guards / covers in place", "Cabin (clean/undamaged)"] },
  { title: "Fluids & Filters", items: ["Engine oil level", "Hydraulic oil level", "Coolant level", "Fuel level", "Air filter indicator"] },
  { title: "Electrical", items: ["Battery (condition/terminals)"] },
  { title: "Undercarriage & Attachments", items: ["Tracks / undercarriage", "Bucket (teeth/cutting edge)", "Boom / stick / linkage pins", "Hydraulic hoses / fittings", "Slew ring / bearing", "Swing mechanism"] },
  { title: "Exhaust & Instruments", items: ["Exhaust system", "Instruments / gauges", "Controls (levers/pedals)"] },
  { title: "Brakes & Steering", items: ["Brakes (service/park)", "Steering"] },
  { title: "Wheels & Tyres", items: ["Tyres / wheels (if applicable)"] },
  { title: "Lubrication & Leaks", items: ["Grease points", "No leaks (oil/fuel/coolant)"] },
  { title: "Loader & Quick Hitch", items: ["Loader arms / linkage", "Quick hitch (if fitted)", "Attachments secure"] },
]

const weeklyAssessmentSections = [
  { title: "Chassis & Bodywork", items: ["Main frame & structure", "Steps, handrails & catwalks", "Covers, panels & doors", "Cab structure & mounting"] },
  { title: "Engine Compartment", items: ["Oil level & condition", "Coolant level & leaks", "Fan, belts & pulleys", "Air intake & filters", "Exhaust system & shields"] },
  { title: "Hydraulic System", items: ["Tank level & breather", "Pump mounting & leaks", "Control valves & levers", "Hoses, pipes & fittings", "Cylinders & seals"] },
  { title: "Electrical System", items: ["Battery condition & terminals", "Wiring harness & connections", "Alternator & starter motor", "Work lights & beacons", "Gauges & monitors"] },
  { title: "Drivetrain & Tyres", items: ["Transmission / Diff levels", "Axle mounting & pivots", "Tyre condition & pressure", "Wheel nuts & rims", "Brake operation (Foot & Park)"] },
  { title: "Safety & Fire", items: ["Fire extinguisher (Charged)", "Automatic fire system", "Hooter & reverse alarm", "Seat belt condition", "Window glass & wipers"] },
]

const dailyChecklistSections = [
  { title: "Visual Checks", items: ["General Machine Condition", "Tyres / Tracks Condition", "Structure / Frame", "Cleanliness"] },
  { title: "Fluid Levels", items: ["Engine Oil", "Coolant / Water", "Hydraulic Oil", "Fuel Level", "Brake Fluid"] },
  { title: "Operational Checks", items: ["Foot Brake", "Emergency / Park Brake", "Steering", "All Lights & Indicators", "Reverse Alarm & Hooter"] },
  { title: "Safety Equipment", items: ["Fire Extinguisher", "Seat Belt", "First Aid Kit", "Safety Guards / Shields"] },
]

const dezziTimberTruckSections = [
  { title: "License and Phepha", items: ["Phepha valid.", "Displayed and visible."] },
  { title: "Protective Structure", items: ["No cracks/damages.", "No bolts missing/loose.", "Guards not damaged and intact."] },
  { title: "Steps and Rails", items: ["Steps in good condition.", "Not loose/broken."] },
  { title: "Bonnet Shock Absorbers", items: ["In place.", "In good condition."] },
  { title: "Cab", items: ["Cab neat and tidy.", "Door and mechanism working.", "Door rubber in good condition.", "Door handles functional."] },
  { title: "Mirrors", items: ["Mirrors in good condition.", "Not damaged.", "Adequately secured – not loose."] },
  { title: "Windscreen, Windows & Wipers", items: ["Clean/secure.", "No cracks or damages to windscreen.", "Window visibility not obscured by cracks.", "Wipers are working."] },
  { title: "Air Conditioner", items: ["In working condition."] },
  { title: "Seats", items: ["Condition of seat.", "Seat secured.", "Rotating lock functional.", "Seat adjuster functional."] },
  { title: "Safety Belt", items: ["Safety belts bolted/secured.", "No damage/not extremely dirty/bleached or dyed.", "Retractor clip in order and clicks into place."] },
  { title: "Steering", items: ["Not loose/responsive.", "No steering play – Not > than 15 degrees.", "Power steering in order/no leaks."] },
  { title: "Hydraulic Controls", items: ["Not loose/responsive.", "No steering play.", "Rear steering.", "Pivot/steering ram pins not loose."] },
  { title: "Hooter and Reverse Alarm", items: ["Hooter working and in good condition.", "Reverse alarm working."] },
  { title: "Gauges", items: ["In working order.", "Any warning symbols/lights."] },
  { title: "Working Lights", items: ["Dim/bright working.", "No fused or damaged bulbs.", "Indicators and hazards working.", "Brake light in working order."] },
  { title: "Rotating Light", items: ["Flashing/rotating beacon light in working condition."] },
  { title: "Braking System (Foot Brake/Exhaust Brake)", items: ["Working.", "Retarder working (check lights on dash)."] },
  { title: "Emergency Park Brake", items: ["Working."] },
  { title: "Oil/Fluid/Air Levels", items: ["Check all oil levels/brake fluid levels/clutch fluid levels are correct.", "Check air gauge in order."] },
  { title: "Fuel, Air and Oil leaks", items: ["No more than 4 drops of oil per minute."] },
  { title: "Grease", items: ["Adequately greased chassis.", "No missing or damaged grease nipples."] },
  { title: "Grill", items: ["Good condition – no damage.", "Not clogged/air is moving freely."] },
  { title: "Battery", items: ["Secure.", "Sufficient water.", "Terminals clean/tight & covers on.", "No exposed wiring."] },
  { title: "Air Pre-Cleaner", items: ["Good condition – no damage/no sucking of air.", "Clean and secure.", "No dust in pre-cleaner bowl."] },
  { title: "V-Belt", items: ["Not squeaking.", "No signs of damage.", "Tension in order."] },
  { title: "Radiator", items: ["Secure.", "Water level correct.", "No signs of leaking."] },
  { title: "Air Tank Drain", items: ["Good condition.", "Drained daily."] },
  { title: "Wiring", items: ["No loose, damaged or exposed wires.", "No loose broken plugs."] },
  { title: "Visibility Triangle", items: ["On the back of the machine.", "Secure.", "Clean and visible."] },
  { title: "Boom Structure", items: ["Not bent/cracked.", "Pins all secured.", "No loose/missing bolts."] },
  { title: "Hydraulic Cylinders", items: ["Good condition – no damage.", "No loose fittings.", "No oil leaks.", "No missing bolts/nuts."] },
  { title: "Hydraulic Hoses and Fittings", items: ["No excessive rubbing.", "No loose brackets/bolts/nuts.", "Smooth operation.", "Jaws not cracked or broken."] },
  { title: "Communication", items: ["Radio or cell phone in working condition.", "Handheld panic alarm functional."] },
  { title: "Chocks", items: ["2 x chocks available.", "In good condition."] },
  { title: "Fire Extinguisher", items: ["Mounted and secured.", "Serviced.", "Gauge in order.", "Seal in place."] },
  { title: "Emergency Triangles", items: ["2 x available as per legal requirements.", "In good condition."] },
]

// ============================================================================
// ICON MAPPING – maps section titles to image filenames
// ============================================================================
const iconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Protective Structure": "protective-structure.png",
  "Exhaust": "exhaust.png",
  "Steps and Rails": "steps-and-rails.png",
  "Cab": "cabs.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Mirrors": "mirrors.png",
  "Air Conditioner": "air-conditioner.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Gauges": "gauges.png",
  "Hydraulic Controls": "hydraulic-controls.png",
  "Air Pre-Cleaner": "air-pre-cleaner.png",
  "Battery": "battery.png",
  "Hydraulic Head Cut Off (Bail Lever)": "bail-lever.png",
  "Fan Belt": "fan-belt.png",
  "Fuel & Oil levels": "fuel-oil-levels.png",
  "Fuel & Oil Leaks": "fuel-leaks.png",
  "Wiring": "wiring.png",
  "Grease": "grease.png",
  "Grill (Sieve)": "grill.png",
  "Working Lights (LED)": "led.png",
  "Radiator": "radiator.png",
  "Rotating Light": "rotating-light.png",
  "Boom Structure": "boom-structure.png",
  "Hydraulic Cylinders": "hydraulic-cylinders.png",
  "Hydraulic Hoses and Fittings": "hydraulic-hoses.png",
  "Harvester Head": "harvester-head.png",
  "Cutting Bar & Chain": "cutting-bar.png",
  "Tracks & Sprockets": "tracks-sprockets.png",
  "All Excess Loose Debris Removed Pre-Shift": "all-excess-loose-debris.png",
  "Escape Hatch & Hammer": "escape-hatch.png",
  "Communication": "communication.png",
  "Fire Systems": "fire-system.png",
  "Bonnet Shock Absorbers": "bonnet-shocks.png",
  "Steering": "excavator-loader-brakes-steering.png",
  "Working Lights": "led.png",
  "Braking System (Foot Brake/Exhaust Brake)": "excavator-loader-brakes-steering.png",
  "Emergency Park Brake": "excavator-loader-brakes-steering.png",
  "Air Tank Drain": "air-tank-drain.png",
  "Visibility Triangle": "visibility-triangle.png",
  "Chocks": "chocks.png",
  "Emergency Triangles": "emergency-triangles.png",
  "Tackle": "hydraulic-hoses.png"
}

// Maps Dezzi section titles to high-risk danger icons
const dezziDangerTypeMap: Record<string, "skull" | "warning"> = {
  "License and Phepha": "skull",
  "Protective Structure": "skull",
  "Safety Belt": "skull",
  "Working Lights": "skull",
  "Steering": "skull",
  "Braking System (Foot Brake/Exhaust Brake)": "skull",
  "Emergency Park Brake": "skull",
  "Fuel, Air and Oil leaks": "skull",
  "Wiring": "skull",
  "Boom Structure": "skull",
  "Fire Extinguisher": "skull",
  "Emergency Triangles": "skull"
}

// Maps Skidder section titles to high-risk danger icons (matches web form)
const skidderDangerTypeMap: Record<string, "skull" | "warning"> = {
  "License and Phepha": "skull",
  "Protective Structure": "skull",
  "Safety Belt": "skull",
  "Working Lights (LED)": "skull",
  "Foot Brake": "skull",
  "Emergency Park Brake": "skull",
  "Fuel, Air and Oil leaks": "skull",
  "Fire Extinguisher": "skull"
}

// ============================================================================
// HELPER: Load any image from public/images/ as base64 (server + client)
// ============================================================================
async function getImageBase64(filename: string): Promise<string> {
  try {
    // Always use client-side fetch for images. Server-side code paths
    // that import this module should not attempt to read the filesystem
    // to avoid bundler errors in Next.js dev/build.
    if (typeof window === 'undefined') {
      // Server: return a small transparent PNG data URI as a safe fallback
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
    }
    const response = await fetch(`/images/${filename}`)
    if (!response.ok) return ''
    const blob = await response.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error(`Failed to load image ${filename}:`, error)
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
  }
}

// ============================================================================
// FORM LABEL HELPERS (unchanged)
// ============================================================================
// Extended for new forms
function formTypeLabel(type: string) {
  switch (type) {
    case "daily-attachment-checklist":
      return "Daily Attachment Checklist"
    case "light-delivery":
      return "Light Delivery Vehicle Daily Checklist"
    case "excavator-loader":
      return "Excavator Loader Pre-Shift Inspection"
    case "excavator-harvester":
      return "Excavator Harvester Pre-Shift Inspection"
    case "lowbed-trailer":
      return "Lowbed & Roll Back Trailer Pre-Shift Inspection"
    case "mechanic-ldv":
      return "Mechanic LDV Daily Checklist"
    case "skidder-pre-shift-inspection":
      return "Skidder (Grapple & Cable) Pre-Shift Inspection Checklist"
    case "timber-truck-and-trailer-checklist":
      return "Timber Truck And Trailer Checklist"
    case "trailer-inspection-checklist":
      return "Trailer (Excluding Labour) Inspection Checklist"
    case "daily-machine-checklist":
      return "Daily Machine Checklist"
    case "weekly-machinery-condition-assessment":
      return "Weekly Machinery Condition Assessment"
    case "cintasign-shorthaul":
      return "Cintasign Shorthaul Trip Sheet"
    case "vehicle-job-card":
      return "Motorized Equipment/Vehicle Job Card"
    case "water-cart-trailer-pressure-washer":
      return "Water Cart Trailer & Pressure Washer Checklist"
    default:
      return type
  }
}

// Extended for new forms
function getDocumentDetails(type: string) {
  switch (type) {
    case "daily-attachment-checklist":
      return { ref: "HSEMS/8.1.19/DOC/0", rev: "1", date: "07.03.2024" }
    case "light-delivery":
      return { ref: "HSEMS/8.1.19/REG/012", rev: "2", date: "27.03.2020" }
    case "excavator-loader":
      return { ref: "HSEMS/8.1.19/REG/002", rev: "4", date: "27.03.2020" }
    case "excavator-harvester":
      return { ref: "HSEMS/8.1.19/REG/001", rev: "5", date: "27.03.2020" }
    case "lowbed-trailer":
      return { ref: "HSEMS/8.1.19/REG/020", rev: "2", date: "27.03.2024" }
    case "mechanic-ldv":
      return { ref: "HSEMS/8.1.19/REG/017", rev: "2", date: "27.03.2020" }
    case "skidder-pre-shift-inspection":
      return { ref: "HSEMS/8.1.19/REG/006", rev: "2", date: "27.03.2020" }
    case "timber-truck-and-trailer-checklist":
      return { ref: "HSEMS/8.1.19/REG/010", rev: "2", date: "20.04.2020" }
    case "trailer-inspection-checklist":
      return { ref: "HSEMS/4.4.6.19/REG/013", rev: "2", date: "27.03.2020" }
    case "daily-machine-checklist":
      return { ref: "HSEMS/8.2.3/REG/01", rev: "1", date: "15.05.2024" }
    case "weekly-machinery-condition-assessment":
      return { ref: "HSEMS/8.2.2/REG/01", rev: "1", date: "15.05.2024" }
    case "cintasign-shorthaul":
      return { ref: "HSEMS/8.2.4/REG/01", rev: "1", date: "15.05.2024" }
    case "vehicle-job-card":
      return { ref: "HSEMS/8.2.1/REG/01", rev: "3", date: "20.04.2020" }
    case "water-cart-trailer-pressure-washer":
      return { ref: "HSEMS/8.1.19/REG/015", rev: "2", date: "23.03.2020" }
    default:
      return { ref: "HSEMS/8.1.19/REG/000", rev: "0", date: "01.01.2020" }
  }
}

function statusLabel(status: CheckStatus): string {
  if (!status) return "-"
  const map: Record<string, string> = { ok: "OK", def: "Defect", na: "N/A" }
  return map[status] ?? "-"
}

function formatFieldKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

// ============================================================================
// CSV EXPORTS (unchanged)
// ============================================================================
function escapeCSV(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`
  }
  return val
}

export function exportSubmissionsToCSV(submissions: Submission[]): void {
  if (submissions.length === 0) return
  const rows: string[][] = []
  rows.push(["ID", "Form Type", "Submitted By", "Date", "Status", "Defect Details", "Signature"])
  for (const sub of submissions) {
    rows.push([
      sub.id,
      formTypeLabel(sub.formType),
      sub.submittedBy,
      new Date(sub.submittedAt).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      sub.hasDefects ? "Defects Found" : "Clean",
      sub.data.defectDetails || "",
      sub.data.signature || "",
    ])
  }
  const csv = rows.map((r) => r.map(escapeCSV).join(",")).join("\n")
  downloadFile(csv, "ringomode-submissions.csv", "text/csv;charset=utf-8;")
}

export function exportSingleSubmissionToCSV(sub: Submission): void {
  const rows: string[][] = []
  rows.push(["Ringomode HSE Management System"])
  rows.push([formTypeLabel(sub.formType)])
  rows.push([])
  rows.push(["Field", "Value"])
  rows.push(["Submitted By", sub.submittedBy])
  rows.push([
    "Date",
    new Date(sub.submittedAt).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  ])
  rows.push(["Status", sub.hasDefects ? "Defects Found" : "Clean"])
  for (const [key, value] of Object.entries(sub.data)) {
    if (key === "items" || key === "hasDefects" || key === "defectDetails" || key === "signature") continue
    rows.push([formatFieldKey(key), String(value) || "-"])
  }
  rows.push([])
  rows.push(["Inspection Item", "Status"])
  if (sub.data.items) {
    for (const [item, status] of Object.entries(sub.data.items)) {
      rows.push([item, statusLabel(status as CheckStatus)])
    }
  }
  rows.push([])
  if (sub.data.defectDetails) {
    rows.push(["Defect Details", sub.data.defectDetails])
  }
  rows.push(["Signature", sub.data.signature || "-"])
  const csv = rows.map((r) => r.map(escapeCSV).join(",")).join("\n")
  const filename = `ringomode-${sub.formType}-${sub.submittedBy.replace(/\s/g, "_")}-${sub.id.slice(0, 8)}.csv`
  downloadFile(csv, filename, "text/csv;charset=utf-8;")
}

// ============================================================================
// LOGO LOADER (fixed – uses dynamic import)
// ============================================================================
async function getLogoBase64(): Promise<string> {
  try {
    if (typeof window === 'undefined') {
      // Server: provide a tiny transparent PNG as fallback
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
    }
    const response = await fetch('/images/ringomode-logo.png')
    if (!response.ok) {
      // Try svg fallback
      try {
        const resp2 = await fetch('/images/ringomode-logo.svg')
        if (!resp2.ok) return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
        const blob2 = await resp2.blob()
        return await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob2)
        })
      } catch (e) {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
      }
    }
    const blob = await response.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Failed to load logo:', error)
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
  }
}

// ============================================================================
// PDF EXPORT – WITH FULL SECTION GROUPING AND ICONS
// ============================================================================
export async function exportSubmissionToPDF(sub: Submission): Promise<void> {
  const { default: jsPDF } = await import("jspdf")
  await import("jspdf-autotable")

  const doc = new jsPDF("p", "mm", "a4")
  const pageWidth = doc.internal.pageSize.getWidth()

  // ----- LOGO -----
  const logoBase64 = await getLogoBase64();
  let yOffset = 15;
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 14, 8, 80, 25);
      yOffset = 48;
    } catch (error) {
      console.error('Failed to add logo to PDF:', error);
      yOffset = 15;
    }
  }

  // ----- Header -----
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text("Ringomode DSP", 14, yOffset)
  doc.text("Excellence - Relevance - Significance", 14, yOffset + 5)

  // Center the HSE header and title while keeping the logo on the left
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text("HSE Management System", pageWidth / 2, yOffset, { align: "center" })

  doc.setDrawColor(34, 100, 54)
  doc.setLineWidth(0.5)
  doc.line(14, yOffset + 9, pageWidth - 14, yOffset + 9)

  // ----- Form Title (centered) -----
  doc.setFontSize(14)
  doc.setTextColor(34, 100, 54)
  doc.text(formTypeLabel(sub.formType), pageWidth / 2, yOffset + 18, { align: 'center' })

  // ----- Document Reference -----
  const docDetails = getDocumentDetails(sub.formType);
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(34, 100, 54)
  doc.text(
    `Document Ref: ${docDetails.ref} | Rev. ${docDetails.rev} | ${docDetails.date}`,
    14,
    yOffset + 26
  )
  doc.setFont('helvetica', 'normal')

  // ----- Status Badge -----
  doc.setFontSize(9)
  if (sub.hasDefects) {
    doc.setTextColor(220, 50, 50)
    doc.text("DEFECTS FOUND", pageWidth - 14, yOffset + 18, { align: "right" })
  } else {
    doc.setTextColor(34, 139, 34)
    doc.text("CLEAN", pageWidth - 14, yOffset + 18, { align: "right" })
  }

  // ----- Form Fields Table -----
  const fieldRows: string[][] = []
  fieldRows.push(["Submitted By", sub.submittedBy])
  const formattedDate = new Date(sub.submittedAt).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  fieldRows.push(["Date", formattedDate])
  for (const [key, value] of Object.entries(sub.data)) {
    if (
      key === "items" ||
      key === "hasDefects" ||
      key === "defectDetails" ||
      key === "signature" ||
      key === "date"
    ) continue
    fieldRows.push([formatFieldKey(key), String(value) || "-"])
  }

  if (fieldRows.length > 0) {
    ; (doc as any).autoTable({
      startY: yOffset + 33,
      head: [["Information", ""]],
      body: fieldRows,
      theme: "grid",
      headStyles: {
        fillColor: [34, 100, 54],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
      tableWidth: "auto",
    })
  }

  // ==========================================================================
  // INSPECTION ITEMS – GROUPED BY SECTION WITH ICONS
  // ==========================================================================
  let y = (doc as any).lastAutoTable?.finalY ?? yOffset + 33
  y += 10

  // Choose sections array based on form type (harvester, loader, or skidder)
  const formSections = sub.formType === 'excavator-harvester'
    ? sections
    : (sub.formType === 'excavator-loader'
      ? loaderSections
      : (sub.formType === 'skidder-pre-shift-inspection'
        ? skidderSections
        : (sub.formType === 'weekly-machinery-condition-assessment'
          ? weeklyAssessmentSections
          : (sub.formType === 'daily-machine-checklist'
            ? dailyChecklistSections
            : null))))

  if (formSections) {
    for (const section of formSections) {
      // Find which items of this section are present in the submission
      const sectionItems = section.items.filter(item => (sub.data as any).items && item in (sub.data as any).items)
      if (sectionItems.length === 0) continue

      // Check page break
      if (y > 250) {
        doc.addPage()
        y = 20
      }

      // ----- Section Title -----
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(34, 100, 54)
      doc.text(section.title, 14, y)
      y += 5

      // Split items into two halves
      const splitIndex = Math.floor(sectionItems.length / 2)
      const firstHalf = sectionItems.slice(0, splitIndex)
      const secondHalf = sectionItems.slice(splitIndex)

      // First half items
      const firstHalfRows = firstHalf.map(item => [
        item,
        statusLabel((sub.data as any).items[item] as CheckStatus)
      ])

      if (firstHalfRows.length > 0) {
        ; (doc as any).autoTable({
          startY: y,
          body: firstHalfRows,
          theme: "grid",
          styles: {
            fontSize: 8,
            cellPadding: 2,
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
          },
          columnStyles: {
            0: { cellWidth: 130, fontStyle: 'bold' },
            1: { cellWidth: 30, halign: 'center' }
          },
          margin: { left: 20, right: 20 },
          didParseCell(data: any) {
            if (data.section === "body" && data.column.index === 1) {
              const val = data.row.raw[1]
              if (val === "Defect") {
                data.cell.styles.textColor = [220, 50, 50]
                data.cell.styles.fontStyle = "bold"
              } else if (val === "OK") {
                data.cell.styles.textColor = [34, 139, 34]
              } else if (val === "N/A") {
                data.cell.styles.textColor = [100, 100, 100]
              }
            }
          },
          showHead: 'never',
        })
        y = (doc as any).lastAutoTable.finalY + 3
      }

      // ----- Icons (Danger + Main) -----
      const iconFilename = iconMap[section.title]
      if (iconFilename) {
        const iconBase64 = await getImageBase64(iconFilename)
        if (iconBase64) {
          try {
            const iconSize = 30
            let currentX = pageWidth / 2 - (iconSize / 2)

            // Render main icon (centered)
            if (iconBase64 && iconBase64.length > 200) {
              const iconSize = 60
              const iconX = (pageWidth - iconSize) / 2
              doc.addImage(iconBase64, 'PNG', iconX, y, iconSize, iconSize)
              y += iconSize + 5
            } else {
              y += 5
            }
            y += iconSize + 5
          } catch (e) {
            console.error(`Failed to add icons for ${section.title}`, e)
            y += 5
          }
        } else {
          y += 5
        }
      } else {
        y += 5
      }

      // ----- Second half items -----
      const secondHalfRows = secondHalf.map(item => [
        item,
        statusLabel(sub.data.items[item] as CheckStatus)
      ])

      if (secondHalfRows.length > 0) {
        ; (doc as any).autoTable({
          startY: y,
          body: secondHalfRows,
          theme: "grid",
          styles: {
            fontSize: 8,
            cellPadding: 2,
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
          },
          columnStyles: {
            0: { cellWidth: 130, fontStyle: 'bold' },
            1: { cellWidth: 30, halign: 'center' }
          },
          margin: { left: 20, right: 20 },
          didParseCell(data: any) {
            if (data.section === "body" && data.column.index === 1) {
              const val = data.row.raw[1]
              if (val === "Defect") {
                data.cell.styles.textColor = [220, 50, 50]
                data.cell.styles.fontStyle = "bold"
              } else if (val === "OK") {
                data.cell.styles.textColor = [34, 139, 34]
              } else if (val === "N/A") {
                data.cell.styles.textColor = [100, 100, 100]
              }
            }
          },
          showHead: 'never',
        })
        y = (doc as any).lastAutoTable.finalY + 8
      }
    }
  } else {
    // ----- Fallback for other form types: list all data fields -----
    const itemRows: string[][] = []

    // Helper to format keys (camelCase to Title Case)
    const formatKey = (key: string) => {
      const result = key.replace(/([A-Z])/g, " $1")
      return result.charAt(0).toUpperCase() + result.slice(1)
    }

    if (sub.data.items) {
      for (const [item, status] of Object.entries(sub.data.items)) {
        itemRows.push([item, statusLabel(status as CheckStatus)])
      }
    } else {
      // For non-checklist forms (Job Card, Shorthaul)
      const ignoredKeys = [
        "signature", "mechanicsSignature", "operatorsSignature",
        "fleetEntries", "breakdownEntries", "items",
        "documentNo", "id", "submittedAt", "submittedBy", "formType"
      ]

      for (const [key, value] of Object.entries(sub.data)) {
        if (!ignoredKeys.includes(key) && value && typeof value === "string") {
          itemRows.push([formatKey(key), value])
        }
      }
    }

    if (itemRows.length > 0) {
      ; (doc as any).autoTable({
        startY: y,
        head: [[sub.data.items ? "Inspection Item" : "Field", sub.data.items ? "Status" : "Value"]],
        body: itemRows,
        theme: "grid",
        headStyles: {
          fillColor: [34, 100, 54],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8,
        },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: "bold" },
          1: { cellWidth: "auto" },
        },
        didParseCell(data: any) {
          if ((sub.data as any).items && data.section === "body" && data.column.index === 1) {
            const val = data.row.raw[1]
            if (val === "Defect") {
              data.cell.styles.textColor = [220, 50, 50]
              data.cell.styles.fontStyle = "bold"
            } else if (val === "OK") {
              data.cell.styles.textColor = [34, 139, 34]
            }
          }
        },
        margin: { left: 14, right: 14 },
      })
      y = (doc as any).lastAutoTable.finalY + 8
    }

    // ----- Cintasign Shorthaul: Fleet & Breakdown Tables -----
    if (sub.formType === "cintasign-shorthaul" && (sub.data as any).fleetEntries) {
      const data = sub.data as any

      // Fleet Entries Table
      doc.setFontSize(10)
      doc.setTextColor(34, 100, 54)
      doc.text("Fleet Entries", 14, y)
      y += 5

      const fleetRows = data.fleetEntries.map((e: any, idx: number) => [
        (idx + 1).toString(), e.fleetNo, e.operator, e.shift, e.noOfLoads, e.estTons, e.hoursWorked
      ])

        ; (doc as any).autoTable({
          startY: y,
          head: [["#", "Fleet No", "Operator", "Shift", "Loads", "Tons", "Hrs Worked"]],
          body: fleetRows,
          theme: "grid",
          headStyles: { fillColor: [78, 140, 49], fontSize: 7 },
          bodyStyles: { fontSize: 7 },
        })
      y = (doc as any).lastAutoTable.finalY + 8

      // Breakdown Entries Table
      doc.setFontSize(10)
      doc.text("Break Down Hours And Details", 14, y)
      y += 5

      const breakdownRows = data.breakdownEntries.map((e: any) => [
        e.machineId, e.operator, e.stop, e.start, e.details
      ])

        ; (doc as any).autoTable({
          startY: y,
          head: [["Machine ID", "Operator", "Stop", "Start", "Details"]],
          body: breakdownRows,
          theme: "grid",
          headStyles: { fillColor: [78, 140, 49], fontSize: 7 },
          bodyStyles: { fontSize: 7 },
        })
      y = (doc as any).lastAutoTable.finalY + 8
    }
  }

  // ----- Brake Efficiency Test (Dezzi Specific) -----
  if (sub.formType === "timber-truck-and-trailer-checklist" && (sub.data as any).brakeEfficiencyTestResult) {
    if (y > 230) {
      doc.addPage()
      y = 15
    }
    doc.setFontSize(10)
    doc.setTextColor(34, 100, 54)
    doc.text("Brake Efficiency Test:", 14, y)
    y += 5

    doc.setFontSize(9)
    doc.setTextColor(60)
    doc.text(`Result: ${(sub.data as any).brakeEfficiencyTestResult}`, 14, y)
    y += 5

    try {
      const brakeImg = await getImageBase64("brake-test-diagram.png")
      if (brakeImg) {
        doc.addImage(brakeImg, "PNG", 14, y, 100, 20)
        y += 25
      }
    } catch (err) {
      console.error("Error adding brake test diagram:", err)
      y += 5
    }
  }

  // ----- Defect Details -----
  if (sub.data.defectDetails) {
    if (y > 260) {
      doc.addPage()
      y = 15
    }
    doc.setFontSize(10)
    doc.setTextColor(220, 50, 50)
    doc.text("Defect Details:", 14, y)
    y += 5
    doc.setFontSize(8)
    doc.setTextColor(60)
    const lines = doc.splitTextToSize(sub.data.defectDetails, pageWidth - 28)
    doc.text(lines, 14, y)
    y += lines.length * 4 + 6
  }

  // ----- Signatures -----
  const signatures = []
  if ((sub.data as any).signature) signatures.push({ label: "Signature", data: (sub.data as any).signature })
  if ((sub.data as any).mechanicsSignature) signatures.push({ label: "Mechanics Signature", data: (sub.data as any).mechanicsSignature })
  if ((sub.data as any).operatorsSignature) signatures.push({ label: "Operators Signature", data: (sub.data as any).operatorsSignature })

  for (const sig of signatures) {
    if (y > 250) {
      doc.addPage()
      y = 15
    }
    doc.setFontSize(10)
    doc.setTextColor(60)
    doc.text(`${sig.label}:`, 14, y)
    y += 5

    if (sig.data && typeof sig.data === "string" && sig.data.startsWith("data:image")) {
      try {
        doc.addImage(sig.data, "PNG", 14, y, 50, 20)
        y += 25
      } catch (err) {
        console.error("Error adding signature image:", err)
        doc.setFontSize(9)
        doc.setFont("helvetica", "italic")
        doc.text("[Signature image failed to load]", 14, y)
        doc.setFont("helvetica", "normal")
        y += 5
      }
    } else {
      doc.setFontSize(9)
      doc.setFont("helvetica", "italic")
      doc.text(sig.data || "-", 14, y)
      doc.setFont("helvetica", "normal")
      y += 5
    }
  }

  // ----- Footer -----
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(150)
    doc.text(
      `Ringomode DSP - HSE Management System | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    )
  }

  const filename = `ringomode-${sub.formType}-${sub.submittedBy.replace(/\s/g, "_")}-${sub.id.slice(0, 8)}.pdf`
  doc.save(filename)
}

// ============================================================================
// DOWNLOAD HELPER (unchanged)
// ============================================================================
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}