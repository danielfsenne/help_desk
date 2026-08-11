package com.helpdesk.controllers;

import com.helpdesk.dto.AttachmentResponseDTO;
import com.helpdesk.dto.CommentRequestDTO;
import com.helpdesk.dto.CommentResponseDTO;
import com.helpdesk.dto.TicketFilter;
import com.helpdesk.dto.TicketRequestDTO;
import com.helpdesk.dto.TicketResponseDTO;
import com.helpdesk.dto.TicketStatusUpdateDTO;
import com.helpdesk.enums.TicketPriority;
import com.helpdesk.enums.TicketStatus;
import com.helpdesk.security.UserPrincipal;
import com.helpdesk.services.AttachmentService;
import com.helpdesk.services.CommentService;
import com.helpdesk.services.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final CommentService commentService;
    private final AttachmentService attachmentService;

    @GetMapping
    public List<TicketResponseDTO> findAll(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Long requesterId,
            @RequestParam(required = false) Long attendantId,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        TicketFilter filter = new TicketFilter(requesterId, attendantId, status, priority, categoryId, search);
        return ticketService.findAll(principal.getUser(), filter);
    }

    @GetMapping("/{id}")
    public TicketResponseDTO findById(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return ticketService.findById(id, principal.getUser());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TicketResponseDTO create(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody TicketRequestDTO dto) {
        return ticketService.create(dto, principal.getUser());
    }

    @PatchMapping("/{id}/assign")
    public TicketResponseDTO assign(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return ticketService.assign(id, principal.getUser());
    }

    @PatchMapping("/{id}/status")
    public TicketResponseDTO updateStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateDTO dto) {
        return ticketService.updateStatus(id, dto, principal.getUser());
    }

    @GetMapping("/{id}/comments")
    public List<CommentResponseDTO> findComments(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return commentService.findByTicket(id, principal.getUser());
    }

    @PostMapping("/{id}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponseDTO addComment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody CommentRequestDTO dto) {
        return commentService.create(id, dto, principal.getUser());
    }

    @GetMapping("/{id}/attachments")
    public List<AttachmentResponseDTO> findAttachments(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return attachmentService.findByTicket(id, principal.getUser());
    }

    @PostMapping("/{id}/attachments")
    @ResponseStatus(HttpStatus.CREATED)
    public AttachmentResponseDTO uploadAttachment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return attachmentService.upload(id, file, principal.getUser());
    }
}
