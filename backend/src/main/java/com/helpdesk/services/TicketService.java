package com.helpdesk.services;

import com.helpdesk.dto.TicketFilter;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TicketResponseDTO> findAll(User principal, TicketFilter filter) {
        Long requesterId = principal.getRole() == Role.CLIENT ? principal.getId() : filter.requesterId();
        String search = (filter.search() == null || filter.search().isBlank()) ? null : filter.search().trim();

        List<Ticket> tickets = ticketRepository.search(
                requesterId, filter.attendantId(), filter.status(), filter.priority(), filter.categoryId(), search);

        return tickets.stream().map(TicketResponseDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public TicketResponseDTO findById(Long id, User principal) {
        Ticket ticket = findEntityById(id);
        checkCanView(ticket, principal);
        return TicketResponseDTO.from(ticket);
    }

    @Transactional
    public TicketResponseDTO create(TicketRequestDTO dto, User requester) {
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

        findLeastBusyAttendant().ifPresent(attendant -> {
            ticket.setAttendant(attendant);
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        });

        return TicketResponseDTO.from(ticketRepository.save(ticket));
    }

    private Optional<User> findLeastBusyAttendant() {
        return userRepository.findByRole(Role.ATTENDANT).stream()
                .min(Comparator.comparingLong(
                        attendant -> ticketRepository.countByAttendantIdAndStatus(attendant.getId(), TicketStatus.IN_PROGRESS)));
    }

    @Transactional
    public TicketResponseDTO assign(Long id, User attendant) {
        Ticket ticket = findEntityById(id);

        if (ticket.getStatus() != TicketStatus.NEW) {
            throw new BusinessException("Somente chamados novos podem ser assumidos");
        }

        ticket.setAttendant(attendant);
        ticket.setStatus(TicketStatus.IN_PROGRESS);

        return TicketResponseDTO.from(ticket);
    }

    @Transactional
    public TicketResponseDTO updateStatus(Long id, TicketStatusUpdateDTO dto, User principal) {
        Ticket ticket = findEntityById(id);
        TicketStatus target = dto.status();

        boolean isAdmin = principal.getRole() == Role.ADMIN;
        boolean isAssignedAttendant = ticket.getAttendant() != null && ticket.getAttendant().getId().equals(principal.getId());
        boolean isRequester = ticket.getRequester().getId().equals(principal.getId());

        if (target == TicketStatus.RESOLVED || target == TicketStatus.IN_PROGRESS) {
            if (!isAdmin && !isAssignedAttendant) {
                throw new AccessDeniedException("Somente o atendente responsável ou um administrador pode alterar esse status");
            }
        } else if (target == TicketStatus.CLOSED) {
            if (!isAdmin && !isRequester) {
                throw new AccessDeniedException("Somente o solicitante ou um administrador pode fechar o chamado");
            }
        }

        changeStatus(ticket, target);
        return TicketResponseDTO.from(ticket);
    }

    void changeStatus(Ticket ticket, TicketStatus newStatus) {
        Set<TicketStatus> allowed = ALLOWED_TRANSITIONS.get(ticket.getStatus());
        if (allowed == null || !allowed.contains(newStatus)) {
            throw new BusinessException(
                    "Transição de status inválida: " + ticket.getStatus() + " -> " + newStatus);
        }

        if (newStatus == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(Instant.now());
        } else if (ticket.getStatus() == TicketStatus.RESOLVED && newStatus == TicketStatus.IN_PROGRESS) {
            ticket.setResolvedAt(null);
        }

        ticket.setStatus(newStatus);
    }

    void checkCanView(Ticket ticket, User principal) {
        if (principal.getRole() == Role.CLIENT && !ticket.getRequester().getId().equals(principal.getId())) {
            throw new AccessDeniedException("Você não tem acesso a esse chamado");
        }
    }

    Ticket findEntityById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chamado não encontrado: " + id));
    }
}
