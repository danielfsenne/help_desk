package com.helpdesk.dto;

import com.helpdesk.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record TicketStatusUpdateDTO(

        @NotNull(message = "status é obrigatório")
        TicketStatus status
) {
}
