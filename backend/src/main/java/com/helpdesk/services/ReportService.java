package com.helpdesk.services;

import com.helpdesk.dto.AttendantLoadDTO;
import com.helpdesk.dto.ReportSummaryDTO;
import com.helpdesk.entities.Ticket;
import com.helpdesk.entities.User;
import com.helpdesk.enums.TicketPriority;
import com.helpdesk.enums.TicketStatus;
import com.helpdesk.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TicketRepository ticketRepository;

    @Transactional(readOnly = true)
    public ReportSummaryDTO summary() {
        List<Ticket> tickets = ticketRepository.findAll();

        Map<TicketStatus, Long> byStatus = new EnumMap<>(TicketStatus.class);
        for (TicketStatus status : TicketStatus.values()) {
            byStatus.put(status, 0L);
        }
        tickets.forEach(t -> byStatus.merge(t.getStatus(), 1L, Long::sum));

        Map<TicketPriority, Long> byPriority = new EnumMap<>(TicketPriority.class);
        for (TicketPriority priority : TicketPriority.values()) {
            byPriority.put(priority, 0L);
        }
        tickets.forEach(t -> byPriority.merge(t.getPriority(), 1L, Long::sum));

        List<Ticket> resolved = tickets.stream().filter(t -> t.getResolvedAt() != null).toList();

        Double avgResolutionMinutes = resolved.isEmpty() ? null : resolved.stream()
                .mapToLong(t -> Duration.between(t.getCreatedAt(), t.getResolvedAt()).toMinutes())
                .average()
                .orElse(0);

        Double slaComplianceRate = resolved.isEmpty() ? null : 100.0 *
                resolved.stream().filter(t -> !t.getResolvedAt().isAfter(t.getSlaDeadline())).count() / resolved.size();

        Map<User, Long> loadByAttendant = tickets.stream()
                .filter(t -> t.getAttendant() != null)
                .collect(Collectors.groupingBy(Ticket::getAttendant, Collectors.counting()));

        List<AttendantLoadDTO> byAttendant = loadByAttendant.entrySet().stream()
                .map(e -> new AttendantLoadDTO(e.getKey().getId(), e.getKey().getName(), e.getValue()))
                .sorted(Comparator.comparing(AttendantLoadDTO::attendantName))
                .toList();

        return new ReportSummaryDTO(byStatus, byPriority, avgResolutionMinutes, slaComplianceRate, byAttendant);
    }
}
