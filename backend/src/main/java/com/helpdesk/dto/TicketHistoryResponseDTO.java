package com.helpdesk.dto;

import com.helpdesk.entities.TicketHistory;

import java.time.Instant;

public record TicketHistoryResponseDTO(
        Long id,
        String description,
        Instant createdAt,
        UserResponseDTO changedBy
) {

    public static TicketHistoryResponseDTO from(TicketHistory history) {
        return new TicketHistoryResponseDTO(
                history.getId(),
                history.getDescription(),
                history.getCreatedAt(),
                UserResponseDTO.from(history.getChangedBy())
        );
    }
}
