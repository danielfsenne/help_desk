package com.helpdesk.services;

import com.helpdesk.dto.CommentRequestDTO;
import com.helpdesk.dto.CommentResponseDTO;
import com.helpdesk.entities.Comment;
import com.helpdesk.entities.Ticket;
import com.helpdesk.entities.User;
import com.helpdesk.enums.Role;
import com.helpdesk.enums.TicketStatus;
import com.helpdesk.exceptions.BusinessException;
import com.helpdesk.repositories.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketService ticketService;
    private final TicketHistoryService ticketHistoryService;

    @Transactional(readOnly = true)
    public List<CommentResponseDTO> findByTicket(Long ticketId, User principal) {
        Ticket ticket = ticketService.findEntityById(ticketId);
        ticketService.checkCanView(ticket, principal);
        return ticket.getComments().stream().map(CommentResponseDTO::from).toList();
    }

    @Transactional
    public CommentResponseDTO create(Long ticketId, CommentRequestDTO dto, User author) {
        Ticket ticket = ticketService.findEntityById(ticketId);
        ticketService.checkCanView(ticket, author);

        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new BusinessException("Chamados fechados não podem receber comentários");
        }

        Comment comment = Comment.builder()
                .message(dto.message())
                .ticket(ticket)
                .author(author)
                .build();

        Comment saved = commentRepository.save(comment);

        if (ticket.getStatus() == TicketStatus.RESOLVED && author.getRole() == Role.CLIENT) {
            ticketService.changeStatus(ticket, TicketStatus.IN_PROGRESS);
            ticketHistoryService.record(ticket, author, "Reaberto automaticamente após resposta de " + author.getName());
        }

        return CommentResponseDTO.from(saved);
    }
}
