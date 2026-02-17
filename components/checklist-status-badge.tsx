import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type Status = "ok" | "def" | "na" | null

interface ChecklistStatusBadgeProps {
  status?: Status
  completion?: number
  className?: string
}

export function ChecklistStatusBadge({ status, completion, className }: ChecklistStatusBadgeProps) {
  if (completion !== undefined) {
    return (
      <Badge className={cn("bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100", className)}>
        {completion}% Complete
      </Badge>
    )
  }

  if (!status) return null

  const statusConfig = {
    ok: {
      label: "OK",
      className: "bg-[hsl(142,76%,36%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(142,76%,32%)]",
    },
    def: {
      label: "Defect",
      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    na: {
      label: "N/A",
      className: "bg-muted text-muted-foreground hover:bg-muted/80",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
