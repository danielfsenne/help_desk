package com.helpdesk.dto;

public record AttendantLoadDTO(
        Long attendantId,
        String attendantName,
        long ticketCount
) {
}
