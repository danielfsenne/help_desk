package com.helpdesk.services;

import com.helpdesk.dto.CommentRequestDTO;
import com.helpdesk.dto.CommentResponseDTO;
import com.helpdesk.entities.Comment;
import com.helpdesk.entities.Ticket;
import com.helpdesk.entities.User;
import com.helpdesk.enums.Role;
import com.helpdesk.enums.TicketStatus;
import com.helpdesk.exceptions.BusinessException;
import com.helpdesk.exceptions.ResourceNotFoundException;
import com.helpdesk.repositories.CommentRepository;
import com.helpdesk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final TicketService ticketService;

    @Transactional(readOnly = true)
    public List<CommentResponseDTO> findByTicket(Long ticketId) {
        Ticket ticket = ticketService.findEntityById(ticketId);
        return ticket.getComments().stream().map(CommentResponseDTO::from).toList();
    }

    @Transactional
    public CommentResponseDTO create(Long ticketId, CommentRequestDTO dto) {
        Ticket ticket = ticketService.findEntityById(ticketId);

        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new BusinessException("Chamados fechados não podem receber comentários");
        }

        User author = userRepository.findById(dto.authorId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + dto.authorId()));

        Comment comment = Comment.builder()
                .message(dto.message())
                .ticket(ticket)
                .author(author)
                .build();

        Comment saved = commentRepository.save(comment);

        if (ticket.getStatus() == TicketStatus.RESOLVED && author.getRole() == Role.CLIENT) {
            ticketService.changeStatus(ticket, TicketStatus.IN_PROGRESS);
        }

        return CommentResponseDTO.from(saved);
    }
}
