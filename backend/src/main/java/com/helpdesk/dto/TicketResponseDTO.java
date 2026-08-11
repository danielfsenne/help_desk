package com.helpdesk.dto;

import com.helpdesk.entities.Ticket;
import com.helpdesk.enums.TicketPriority;
import com.helpdesk.enums.TicketStatus;

import java.time.Instant;

public record TicketResponseDTO(
        Long id,
        String title,
        String description,
        TicketStatus status,
        TicketPriority priority,
        Instant createdAt,
        Instant updatedAt,
        UserResponseDTO requester,
        UserResponseDTO attendant,
        CategoryResponseDTO category
) {

    public static TicketResponseDTO from(Ticket ticket) {
        return new TicketResponseDTO(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getStatus(),
                ticket.getPriority(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                UserResponseDTO.from(ticket.getRequester()),
                ticket.getAttendant() != null ? UserResponseDTO.from(ticket.getAttendant()) : null,
                CategoryResponseDTO.from(ticket.getCategory())
        );
    }
}
