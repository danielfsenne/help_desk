import { http } from './http'
import type { TicketPriority, TicketStatus } from '../types'

export interface AttendantLoad {
  attendantId: number
  attendantName: string
  ticketCount: number
}

export interface ReportSummary {
  byStatus: Record<TicketStatus, number>
  byPriority: Record<TicketPriority, number>
  avgResolutionMinutes: number | null
  slaComplianceRate: number | null
  byAttendant: AttendantLoad[]
}

export async function getReportSummary(): Promise<ReportSummary> {
  const { data } = await http.get<ReportSummary>('/reports/summary')
  return data
}
