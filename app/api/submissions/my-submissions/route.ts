import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getSubmissions } from '@/lib/submissions'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const all = getSubmissions()
  const filtered = all.filter((s) => {
    const name = session.user?.name || ''
    const email = session.user?.email || ''
    if (!name && !email) return false

    if (s.submittedBy && s.submittedBy === name) return true
    if (s.data?.operatorName && s.data.operatorName === name) return true
    if (s.data?.email && s.data.email === email) return true
    if (s.data?.operatorEmail && s.data.operatorEmail === email) return true

    return false
  })

  return NextResponse.json(filtered)
}
