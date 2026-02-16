import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { addSubmission, getSubmissions, deleteSubmission, getSubmissionById } from "@/lib/submissions"; // submissions helpers
import type { Submission } from "@/lib/types";

export async function GET() {
  const submissions = getSubmissions();
  return NextResponse.json(submissions);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
  }
  try {
    // simple auth guard could be added here if desired by importing auth
    const { id } = params
    const existing = getSubmissionById(id)
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const ok = deleteSubmission(id)
    if (!ok) {
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Delete submission error", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const submission: Submission = {
      id: crypto.randomUUID(),
      formType: body.formType,
      formTitle: body.formTitle,
      submittedBy: body.submittedBy,
      submittedAt: new Date().toISOString(),
      data: body.data,
      hasDefects: body.hasDefects || false,
    };

    addSubmission(submission); // ✅ This adds to the SAME array

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit form:", error);
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 });
  }
}