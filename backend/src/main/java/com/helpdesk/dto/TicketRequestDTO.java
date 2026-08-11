package com.helpdesk.dto;

import com.helpdesk.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TicketRequestDTO(

        @NotBlank(message = "título é obrigatório")
        String title,

        @NotBlank(message = "descrição é obrigatória")
        String description,

        @NotNull(message = "prioridade é obrigatória")
        TicketPriority priority,

        @NotNull(message = "solicitante é obrigatório")
        Long requesterId,

        @NotNull(message = "categoria é obrigatória")
        Long categoryId
) {
}
