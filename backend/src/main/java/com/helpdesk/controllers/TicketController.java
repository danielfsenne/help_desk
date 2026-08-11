package com.helpdesk.controllers;

import com.helpdesk.dto.CommentRequestDTO;
import com.helpdesk.dto.CommentResponseDTO;
import com.helpdesk.dto.TicketAssignDTO;
import com.helpdesk.dto.TicketRequestDTO;
import com.helpdesk.dto.TicketResponseDTO;
import com.helpdesk.dto.TicketStatusUpdateDTO;
import com.helpdesk.services.CommentService;
import com.helpdesk.services.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final CommentService commentService;

    @GetMapping
    public List<TicketResponseDTO> findAll(
            @RequestParam(required = false) Long requesterId,
            @RequestParam(required = false) Long attendantId) {
        return ticketService.findAll(requesterId, attendantId);
    }

    @GetMapping("/{id}")
    public TicketResponseDTO findById(@PathVariable Long id) {
        return ticketService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TicketResponseDTO create(@Valid @RequestBody TicketRequestDTO dto) {
        return ticketService.create(dto);
    }

    @PatchMapping("/{id}/assign")
    public TicketResponseDTO assign(@PathVariable Long id, @Valid @RequestBody TicketAssignDTO dto) {
        return ticketService.assign(id, dto);
    }

    @PatchMapping("/{id}/status")
    public TicketResponseDTO updateStatus(@PathVariable Long id, @Valid @RequestBody TicketStatusUpdateDTO dto) {
        return ticketService.updateStatus(id, dto);
    }

    @GetMapping("/{id}/comments")
    public List<CommentResponseDTO> findComments(@PathVariable Long id) {
        return commentService.findByTicket(id);
    }

    @PostMapping("/{id}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponseDTO addComment(@PathVariable Long id, @Valid @RequestBody CommentRequestDTO dto) {
        return commentService.create(id, dto);
    }
}
