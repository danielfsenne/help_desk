package com.helpdesk.repositories;

import com.helpdesk.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByRequesterId(Long requesterId);

    List<Ticket> findByAttendantId(Long attendantId);
}
