"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScoreBadge, TierBadge, PriorityBadge } from "@/components/score-badge"
import { EditLeadDialog } from "@/components/edit-lead-dialog"
import type { Lead, TeamMember, LeadStatus, LeadBucket } from "@/lib/types"
import { getTierInfo } from "@/lib/scoring"
import {
  User,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Megaphone,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Columns,
  Phone,
  Globe,
  Star,
  Instagram,
  CircleDot,
  Trash2,
  FolderOpen,
  FolderInput,
} from "lucide-react"

interface LeadsTableProps {
  leads: Lead[]
  teamMembers: TeamMember[]
  buckets: LeadBucket[]
  onUpdateLead: (lead: Lead) => Promise<void>
  onDeleteLead: (leadId: string) => Promise<void>
  onDeleteLeads: (leadIds: string[]) => Promise<void>
  onBulkMoveToBucket?: (leadIds: string[], bucketId: string) => Promise<void>
}

const roleColors: Record<string, string> = {
  "Enterprise Sales": "text-violet-600 dark:text-violet-400",
  "Senior Sales Rep": "text-emerald-600 dark:text-emerald-400",
  "Mid-level Rep": "text-blue-600 dark:text-blue-400",
  "Junior Rep / SDR": "text-amber-600 dark:text-amber-400",
  "Marketing Automation": "text-slate-600 dark:text-slate-400",
}

const roleBgColors: Record<string, string> = {
  "Enterprise Sales": "bg-violet-100 dark:bg-violet-900/30",
  "Senior Sales Rep": "bg-emerald-100 dark:bg-emerald-900/30",
  "Mid-level Rep": "bg-blue-100 dark:bg-blue-900/30",
  "Junior Rep / SDR": "bg-amber-100 dark:bg-amber-900/30",
  "Marketing Automation": "bg-slate-100 dark:bg-slate-900/30",
}

const statusColors: Record<LeadStatus, { bg: string; text: string }> = {
  contacted: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  rejected: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300" },
  "bad timing": { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
  ghosted: { bg: "bg-gray-100 dark:bg-gray-900/30", text: "text-gray-700 dark:text-gray-300" },
  "discovery call": { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
  "proposal sent": { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
  closed: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

type ColumnId =
  | "select"
  | "lead"
  | "company"
  | "phone"
  | "website"
  | "rating"
  | "instagram"
  | "status"
  | "bucket"
  | "location"
  | "industry"
  | "budget"
  | "source"
  | "score"
  | "tier"
  | "priority"
  | "sla"
  | "assignedTo"

interface ColumnDef {
  id: ColumnId
  label: string
  icon: React.ReactNode
  defaultVisible: boolean
  sortable: boolean
  defaultWidth: number
}

const COLUMNS: ColumnDef[] = [
  {
    id: "select",
    label: "",
    icon: null,
    defaultVisible: true,
    sortable: false,
    defaultWidth: 40,
  },
  {
    id: "lead",
    label: "Lead",
    icon: <User className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 200,
  },
  {
    id: "company",
    label: "Company",
    icon: <Building2 className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 150,
  },
  {
    id: "phone",
    label: "Phone",
    icon: <Phone className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 140,
  },
  {
    id: "website",
    label: "Website",
    icon: <Globe className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 150,
  },
  {
    id: "rating",
    label: "Rating",
    icon: <Star className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 100,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 140,
  },
  {
    id: "status",
    label: "Status",
    icon: <CircleDot className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 130,
  },
  {
    id: "bucket",
    label: "Bucket",
    icon: <FolderOpen className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 120,
  },
  {
    id: "location",
    label: "Location",
    icon: <MapPin className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 120,
  },
  {
    id: "industry",
    label: "Industry",
    icon: <Briefcase className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 120,
  },
  {
    id: "budget",
    label: "Budget",
    icon: <DollarSign className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 120,
  },
  {
    id: "source",
    label: "Source",
    icon: <Megaphone className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 120,
  },
  { id: "score", label: "Score", icon: null, defaultVisible: true, sortable: true, defaultWidth: 80 },
  { id: "tier", label: "Tier", icon: null, defaultVisible: true, sortable: true, defaultWidth: 100 },
  { id: "priority", label: "Priority", icon: null, defaultVisible: true, sortable: true, defaultWidth: 100 },
  {
    id: "sla",
    label: "SLA",
    icon: <Clock className="h-4 w-4" />,
    defaultVisible: true,
    sortable: true,
    defaultWidth: 100,
  },
  { id: "assignedTo", label: "Assigned To", icon: null, defaultVisible: true, sortable: true, defaultWidth: 180 },
]

type SortDirection = "asc" | "desc" | null

export function LeadsTable({
  leads,
  teamMembers,
  buckets,
  onUpdateLead,
  onDeleteLead,
  onDeleteLeads,
  onBulkMoveToBucket,
}: LeadsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())

  const [sortColumn, setSortColumn] = useState<ColumnId | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnId>>(
    () => new Set(COLUMNS.filter((col) => col.defaultVisible).map((col) => col.id)),
  )

  const [columnWidths, setColumnWidths] = useState<Record<ColumnId, number>>(() =>
    COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: col.defaultWidth }), {} as Record<ColumnId, number>),
  )

  // Resizing state
  const [resizingColumn, setResizingColumn] = useState<ColumnId | null>(null)
  const resizeStartX = useRef(0)
  const resizeStartWidth = useRef(0)

  const getAssignedRep = (assignedTo: string | null) => {
    if (!assignedTo) return null
    return teamMembers.find((m) => m.id === assignedTo)
  }

  const getBucketName = (bucketId: string | undefined) => {
    if (!bucketId) return null
    return buckets.find((b) => b.id === bucketId)
  }

  const sortedLeads = [...leads].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0

    let aValue: string | number | null | undefined
    let bValue: string | number | null | undefined

    switch (sortColumn) {
      case "lead":
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case "company":
        aValue = a.company.toLowerCase()
        bValue = b.company.toLowerCase()
        break
      case "phone":
        aValue = a.phone?.toLowerCase() || ""
        bValue = b.phone?.toLowerCase() || ""
        break
      case "website":
        aValue = a.website?.toLowerCase() || ""
        bValue = b.website?.toLowerCase() || ""
        break
      case "rating":
        aValue = a.rating || 0
        bValue = b.rating || 0
        break
      case "instagram":
        aValue = a.instagram?.toLowerCase() || ""
        bValue = b.instagram?.toLowerCase() || ""
        break
      case "status":
        aValue = a.status || ""
        bValue = b.status || ""
        break
      case "bucket":
        aValue = getBucketName(a.bucket)?.name.toLowerCase() || ""
        bValue = getBucketName(b.bucket)?.name.toLowerCase() || ""
        break
      case "location":
        aValue = a.location.toLowerCase()
        bValue = b.location.toLowerCase()
        break
      case "industry":
        aValue = a.industry.toLowerCase()
        bValue = b.industry.toLowerCase()
        break
      case "budget":
        aValue = a.budget
        bValue = b.budget
        break
      case "source":
        aValue = a.source.toLowerCase()
        bValue = b.source.toLowerCase()
        break
      case "score":
        aValue = a.score
        bValue = b.score
        break
      case "tier":
        aValue = a.tier || getTierInfo(a.score).tier
        bValue = b.tier || getTierInfo(b.score).tier
        break
      case "priority":
        aValue = a.priority || getTierInfo(a.score).priority
        bValue = b.priority || getTierInfo(b.score).priority
        break
      case "sla":
        aValue = a.responseTime || getTierInfo(a.score).responseTime
        bValue = b.responseTime || getTierInfo(b.score).responseTime
        break
      case "assignedTo":
        const aRep = getAssignedRep(a.assignedTo)
        const bRep = getAssignedRep(b.assignedTo)
        aValue = aRep?.name.toLowerCase() || ""
        bValue = bRep?.name.toLowerCase() || ""
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedLeads.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedLeads = sortedLeads.slice(startIndex, endIndex)

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(Number(newSize))
    setCurrentPage(1)
  }

  const handleRowClick = (lead: Lead) => {
    setEditingLead(lead)
    setEditDialogOpen(true)
  }

  const handleSaveLead = async (updatedLead: Lead) => {
    await onUpdateLead(updatedLead)
  }

  const handleSort = (columnId: ColumnId) => {
    if (columnId === "select") return
    if (sortColumn === columnId) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(columnId)
      setSortDirection("asc")
    }
  }

  const toggleColumn = (columnId: ColumnId) => {
    if (columnId === "select") return
    setVisibleColumns((prev) => {
      const next = new Set(prev)
      if (next.has(columnId)) {
        next.delete(columnId)
      } else {
        next.add(columnId)
      }
      return next
    })
  }

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, columnId: ColumnId) => {
      e.preventDefault()
      e.stopPropagation()
      setResizingColumn(columnId)
      resizeStartX.current = e.clientX
      resizeStartWidth.current = columnWidths[columnId]
    },
    [columnWidths],
  )

  useEffect(() => {
    if (!resizingColumn) return

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizeStartX.current
      const newWidth = Math.max(60, resizeStartWidth.current + delta)
      setColumnWidths((prev) => ({ ...prev, [resizingColumn]: newWidth }))
    }

    const handleMouseUp = () => {
      setResizingColumn(null)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [resizingColumn])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(new Set(paginatedLeads.map((l) => l.id)))
    } else {
      setSelectedLeads(new Set())
    }
  }

  const handleSelectLead = (leadId: string, checked: boolean) => {
    setSelectedLeads((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(leadId)
      } else {
        next.delete(leadId)
      }
      return next
    })
  }

  const handleDeleteSelected = async () => {
    await onDeleteLeads(Array.from(selectedLeads))
    setSelectedLeads(new Set())
  }

  // Added handler for bulk move
  const handleBulkMoveToBucket = async (bucketId: string) => {
    if (onBulkMoveToBucket && selectedLeads.size > 0) {
      await onBulkMoveToBucket(Array.from(selectedLeads), bucketId)
      setSelectedLeads(new Set())
    }
  }

  const renderSortIcon = (columnId: ColumnId) => {
    if (sortColumn !== columnId) {
      return <ArrowUpDown className="h-3 w-3 opacity-50" />
    }
    return sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  const renderCellContent = (lead: Lead, columnId: ColumnId) => {
    const tierInfo = getTierInfo(lead.score)
    const assignedRep = getAssignedRep(lead.assignedTo)

    switch (columnId) {
      case "select":
        return (
          <Checkbox
            checked={selectedLeads.has(lead.id)}
            onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
            onClick={(e) => e.stopPropagation()}
          />
        )
      case "lead":
        return (
          <div>
            <div className="font-medium">{lead.name}</div>
            <div className="text-sm text-muted-foreground">{lead.email}</div>
          </div>
        )
      case "company":
        return lead.company
      case "phone":
        return lead.phone ? (
          <a
            href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline"
            onClick={(e) => e.stopPropagation()}
          >
            {lead.phone}
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      case "website":
        return lead.website ? (
          <a
            href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline truncate block max-w-[140px]"
            onClick={(e) => e.stopPropagation()}
          >
            {lead.website.replace(/^https?:\/\//, "")}
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      case "rating":
        return lead.rating !== undefined ? (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{lead.rating.toFixed(1)}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      case "instagram":
        return lead.instagram ? (
          <a
            href={`https://instagram.com/${lead.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
            onClick={(e) => e.stopPropagation()}
          >
            {lead.instagram.startsWith("@") ? lead.instagram : `@${lead.instagram}`}
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      case "status":
        return lead.status ? (
          <Badge className={`${statusColors[lead.status].bg} ${statusColors[lead.status].text} border-0`}>
            {lead.status}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      case "bucket":
        const bucket = getBucketName(lead.bucket)
        return bucket ? (
          <Badge variant="outline" className="gap-1">
            <div className={`w-2 h-2 rounded-full bg-${bucket.color}-500`} />
            {bucket.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      case "location":
        return lead.location
      case "industry":
        return lead.industry
      case "budget":
        return `$${lead.budget.toLocaleString()}`
      case "source":
        return <Badge variant="outline">{lead.source}</Badge>
      case "score":
        return <ScoreBadge score={lead.score} />
      case "tier":
        return <TierBadge tier={lead.tier || tierInfo.tier} />
      case "priority":
        return <PriorityBadge priority={lead.priority || tierInfo.priority} />
      case "sla":
        return <span className="text-sm text-muted-foreground">{lead.responseTime || tierInfo.responseTime}</span>
      case "assignedTo":
        return assignedRep ? (
          <div className="flex items-center gap-2">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${roleBgColors[assignedRep.role] || "bg-primary/10"} ${roleColors[assignedRep.role] || ""}`}
            >
              {assignedRep.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <span className="text-sm">{assignedRep.name}</span>
              <div className={`text-xs ${roleColors[assignedRep.role] || "text-muted-foreground"}`}>
                {assignedRep.role}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Unassigned</span>
        )
      default:
        return null
    }
  }

  const visibleColumnsList = COLUMNS.filter((col) => visibleColumns.has(col.id))
  const isAllSelected = paginatedLeads.length > 0 && paginatedLeads.every((l) => selectedLeads.has(l.id))
  const isSomeSelected = paginatedLeads.some((l) => selectedLeads.has(l.id))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {selectedLeads.size > 0 && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete ({selectedLeads.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {selectedLeads.size} leads?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The selected leads will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSelected} className="bg-destructive">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <FolderInput className="h-4 w-4" />
                    Move to Bucket ({selectedLeads.size})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Select Bucket</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {buckets
                    .filter((b) => b.id !== "all")
                    .map((bucket) => (
                      <DropdownMenuCheckboxItem
                        key={bucket.id}
                        onClick={() => handleBulkMoveToBucket(bucket.id)}
                        className="gap-2"
                      >
                        <div className={`w-2 h-2 rounded-full bg-${bucket.color}-500`} />
                        {bucket.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Columns className="h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {COLUMNS.filter((col) => col.id !== "select").map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={visibleColumns.has(column.id)}
                onCheckedChange={() => toggleColumn(column.id)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumnsList.map((column) => (
                <TableHead
                  key={column.id}
                  style={{ width: columnWidths[column.id], minWidth: columnWidths[column.id] }}
                  className="relative group"
                >
                  {column.id === "select" ? (
                    <Checkbox
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) {
                          ;(el as unknown as HTMLInputElement).indeterminate = isSomeSelected && !isAllSelected
                        }
                      }}
                      onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                    />
                  ) : (
                    <div
                      className={`flex items-center gap-1.5 ${column.sortable ? "cursor-pointer select-none hover:text-foreground" : ""}`}
                      onClick={() => column.sortable && handleSort(column.id)}
                    >
                      {column.icon}
                      {column.label}
                      {column.sortable && <span className="ml-1">{renderSortIcon(column.id)}</span>}
                    </div>
                  )}
                  {column.id !== "select" && (
                    <div
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 group-hover:bg-border"
                      onMouseDown={(e) => handleResizeStart(e, column.id)}
                    />
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumnsList.length} className="text-center py-8 text-muted-foreground">
                  No leads yet. Add a lead or import from CSV to get started.
                </TableCell>
              </TableRow>
            ) : paginatedLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumnsList.length} className="text-center py-8 text-muted-foreground">
                  No leads match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedLeads.has(lead.id) ? "bg-muted/30" : ""}`}
                  onClick={() => handleRowClick(lead)}
                >
                  {visibleColumnsList.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ width: columnWidths[column.id], minWidth: columnWidths[column.id] }}
                      className={
                        column.id === "score" || column.id === "tier" || column.id === "priority" ? "text-center" : ""
                      }
                    >
                      {renderCellContent(lead, column.id)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {leads.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing</span>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>of {sortedLeads.length} leads</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <EditLeadDialog
        lead={editingLead}
        teamMembers={teamMembers}
        buckets={buckets}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveLead}
        onDelete={onDeleteLead}
      />
    </div>
  )
}
