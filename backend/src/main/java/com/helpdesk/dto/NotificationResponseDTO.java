package com.helpdesk.dto;

import com.helpdesk.entities.Notification;

import java.time.Instant;

public record NotificationResponseDTO(
        Long id,
        String message,
        Long ticketId,
        boolean read,
        Instant createdAt
) {

    public static NotificationResponseDTO from(Notification notification) {
        return new NotificationResponseDTO(
                notification.getId(),
                notification.getMessage(),
                notification.getTicket().getId(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
