package com.helpdesk.services;

import com.helpdesk.dto.TicketAssignDTO;
import com.helpdesk.dto.TicketRequestDTO;
import com.helpdesk.dto.TicketResponseDTO;
import com.helpdesk.dto.TicketStatusUpdateDTO;
import com.helpdesk.entities.Category;
import com.helpdesk.entities.Ticket;
import com.helpdesk.entities.User;
import com.helpdesk.enums.Role;
import com.helpdesk.enums.TicketStatus;
import com.helpdesk.exceptions.BusinessException;
import com.helpdesk.exceptions.ResourceNotFoundException;
import com.helpdesk.repositories.CategoryRepository;
import com.helpdesk.repositories.TicketRepository;
import com.helpdesk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TicketService {

    private static final Map<TicketStatus, Set<TicketStatus>> ALLOWED_TRANSITIONS = new EnumMap<>(TicketStatus.class);

    static {
        ALLOWED_TRANSITIONS.put(TicketStatus.NEW, EnumSet.of(TicketStatus.IN_PROGRESS));
        ALLOWED_TRANSITIONS.put(TicketStatus.IN_PROGRESS, EnumSet.of(TicketStatus.RESOLVED));
        ALLOWED_TRANSITIONS.put(TicketStatus.RESOLVED, EnumSet.of(TicketStatus.CLOSED, TicketStatus.IN_PROGRESS));
        ALLOWED_TRANSITIONS.put(TicketStatus.CLOSED, EnumSet.noneOf(TicketStatus.class));
    }

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<TicketResponseDTO> findAll(Long requesterId, Long attendantId) {
        List<Ticket> tickets;
        if (requesterId != null) {
            tickets = ticketRepository.findByRequesterId(requesterId);
        } else if (attendantId != null) {
            tickets = ticketRepository.findByAttendantId(attendantId);
        } else {
            tickets = ticketRepository.findAll();
        }
        return tickets.stream().map(TicketResponseDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public TicketResponseDTO findById(Long id) {
        return TicketResponseDTO.from(findEntityById(id));
    }

    @Transactional
    public TicketResponseDTO create(TicketRequestDTO dto) {
        User requester = userRepository.findById(dto.requesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Solicitante não encontrado: " + dto.requesterId()));

        Category category = categoryRepository.findById(dto.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada: " + dto.categoryId()));

        Ticket ticket = Ticket.builder()
                .title(dto.title())
                .description(dto.description())
                .priority(dto.priority())
                .status(TicketStatus.NEW)
                .requester(requester)
                .category(category)
                .build();

        return TicketResponseDTO.from(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponseDTO assign(Long id, TicketAssignDTO dto) {
        Ticket ticket = findEntityById(id);

        User attendant = userRepository.findById(dto.attendantId())
                .orElseThrow(() -> new ResourceNotFoundException("Atendente não encontrado: " + dto.attendantId()));

        if (attendant.getRole() != Role.ATTENDANT && attendant.getRole() != Role.ADMIN) {
            throw new BusinessException("Somente atendentes ou administradores podem assumir um chamado");
        }

        if (ticket.getStatus() != TicketStatus.NEW) {
            throw new BusinessException("Somente chamados novos podem ser assumidos");
        }

        ticket.setAttendant(attendant);
        ticket.setStatus(TicketStatus.IN_PROGRESS);

        return TicketResponseDTO.from(ticket);
    }

    @Transactional
    public TicketResponseDTO updateStatus(Long id, TicketStatusUpdateDTO dto) {
        Ticket ticket = findEntityById(id);
        changeStatus(ticket, dto.status());
        return TicketResponseDTO.from(ticket);
    }

    void changeStatus(Ticket ticket, TicketStatus newStatus) {
        Set<TicketStatus> allowed = ALLOWED_TRANSITIONS.get(ticket.getStatus());
        if (allowed == null || !allowed.contains(newStatus)) {
            throw new BusinessException(
                    "Transição de status inválida: " + ticket.getStatus() + " -> " + newStatus);
        }
        ticket.setStatus(newStatus);
    }

    Ticket findEntityById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chamado não encontrado: " + id));
    }
}
