package com.helpdesk.services;

import com.helpdesk.dto.NotificationResponseDTO;
import com.helpdesk.entities.Notification;
import com.helpdesk.entities.Ticket;
import com.helpdesk.entities.User;
import com.helpdesk.exceptions.ResourceNotFoundException;
import com.helpdesk.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void notify(User recipient, User actor, Ticket ticket, String message) {
        if (recipient == null || recipient.getId().equals(actor.getId())) {
            return;
        }

        Notification notification = Notification.builder()
                .recipient(recipient)
                .ticket(ticket)
                .message(message)
                .build();

        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> findMine(User principal) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(principal.getId()).stream()
                .map(NotificationResponseDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Long> countUnread(User principal) {
        return Map.of("unread", notificationRepository.countByRecipientIdAndReadFalse(principal.getId()));
    }

    @Transactional
    public void markAsRead(Long id, User principal) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificação não encontrada: " + id));

        if (!notification.getRecipient().getId().equals(principal.getId())) {
            throw new AccessDeniedException("Você não tem acesso a essa notificação");
        }

        notification.setRead(true);
    }
}
