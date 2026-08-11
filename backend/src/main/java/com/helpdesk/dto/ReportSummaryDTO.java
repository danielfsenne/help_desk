package com.helpdesk.dto;

import com.helpdesk.enums.TicketPriority;
import com.helpdesk.enums.TicketStatus;

import java.util.List;
import java.util.Map;

public record ReportSummaryDTO(
        Map<TicketStatus, Long> byStatus,
        Map<TicketPriority, Long> byPriority,
        Double avgResolutionMinutes,
        Double slaComplianceRate,
        List<AttendantLoadDTO> byAttendant
) {
}
