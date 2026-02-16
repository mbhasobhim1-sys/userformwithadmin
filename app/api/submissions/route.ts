import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { addSubmission, getSubmissions } from "@/lib/submissions"
import type { Submission } from "@/lib/types"

export async function GET() {
  const session = await auth()

  // Only authenticated users can access submissions
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  // Only admins can view all submissions
  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    )
  }

  const submissions = getSubmissions()
  return NextResponse.json(submissions)
}

export async function POST(request: Request) {
  const session = await auth()

  // Only authenticated users can submit
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    
    const submission: Submission = {
      id: crypto.randomUUID(),
      formType: body.formType,
      formTitle: body.formTitle,
      submittedBy: body.submittedBy,
      submittedAt: new Date().toISOString(),
      data: body.data,
      hasDefects: body.hasDefects,
    }

    addSubmission(submission)

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 })
  } catch (error) {
    console.error("Failed to submit form:", error)
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
  }
}
