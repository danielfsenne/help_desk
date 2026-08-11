package com.helpdesk.services;

import com.helpdesk.dto.TicketHistoryResponseDTO;
import com.helpdesk.entities.Ticket;
import com.helpdesk.entities.TicketHistory;
import com.helpdesk.entities.User;
import com.helpdesk.repositories.TicketHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketHistoryService {

    private final TicketHistoryRepository ticketHistoryRepository;

    @Transactional
    public void record(Ticket ticket, User changedBy, String description) {
        TicketHistory history = TicketHistory.builder()
                .ticket(ticket)
                .changedBy(changedBy)
                .description(description)
                .build();

        ticketHistoryRepository.save(history);
    }

    @Transactional(readOnly = true)
    public List<TicketHistoryResponseDTO> findByTicket(Long ticketId) {
        return ticketHistoryRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(TicketHistoryResponseDTO::from)
                .toList();
    }
}
