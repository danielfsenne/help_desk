package com.helpdesk.dto;

import com.helpdesk.enums.TicketPriority;
import com.helpdesk.enums.TicketStatus;

public record TicketFilter(
        Long requesterId,
        Long attendantId,
        TicketStatus status,
        TicketPriority priority,
        Long categoryId,
        String search
) {
}
