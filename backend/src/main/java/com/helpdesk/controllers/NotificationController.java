package com.helpdesk.controllers;

import com.helpdesk.dto.NotificationResponseDTO;
import com.helpdesk.security.UserPrincipal;
import com.helpdesk.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationResponseDTO> findMine(@AuthenticationPrincipal UserPrincipal principal) {
        return notificationService.findMine(principal.getUser());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount(@AuthenticationPrincipal UserPrincipal principal) {
        return notificationService.countUnread(principal.getUser());
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        notificationService.markAsRead(id, principal.getUser());
    }
}
