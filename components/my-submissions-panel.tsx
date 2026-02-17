"use client"

import React, { useEffect, useState } from 'react'
import { exportSubmissionToPDF, exportSingleSubmissionToCSV } from '@/lib/export-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import type { Submission } from '@/lib/types'
import { toast } from 'sonner'

export function MySubmissionsPanel() {
  const [subs, setSubs] = useState<Submission[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function fetchMy() {
      setLoading(true)
      try {
        const res = await fetch('/api/submissions/my-submissions')
        if (res.status === 401) {
          toast.error('Please sign in to view your submissions')
          setSubs([])
          return
        }
        const data = await res.json()
        if (mounted) setSubs(data || [])
      } catch (err) {
        console.error('Failed to fetch my submissions', err)
        if (mounted) setSubs([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchMy()
    return () => { mounted = false }
  }, [])

  if (loading) return <div>Loading...</div>
  if (!subs || subs.length === 0) return <div>No submissions yet</div>

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.formTitle}</TableCell>
                  <TableCell>{new Date(s.submittedAt).toLocaleString()}</TableCell>
                  <TableCell>{s.hasDefects ? 'Defects' : 'Clean'}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => exportSubmissionToPDF(s)}>
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => exportSingleSubmissionToCSV(s)}>
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
