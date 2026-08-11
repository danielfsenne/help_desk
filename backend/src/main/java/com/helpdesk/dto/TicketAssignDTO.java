package com.helpdesk.dto;

import jakarta.validation.constraints.NotNull;

public record TicketAssignDTO(

        @NotNull(message = "atendente é obrigatório")
        Long attendantId
) {
}
