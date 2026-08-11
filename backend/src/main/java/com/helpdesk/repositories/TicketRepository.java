package com.helpdesk.repositories;

import com.helpdesk.entities.Ticket;
import com.helpdesk.enums.TicketPriority;
import com.helpdesk.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    long countByAttendantIdAndStatus(Long attendantId, TicketStatus status);

    @Query("""
            SELECT t FROM Ticket t
            WHERE (:requesterId IS NULL OR t.requester.id = :requesterId)
              AND (:attendantId IS NULL OR t.attendant.id = :attendantId)
              AND (:status IS NULL OR t.status = :status)
              AND (:priority IS NULL OR t.priority = :priority)
              AND (:categoryId IS NULL OR t.category.id = :categoryId)
              AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))
            ORDER BY t.createdAt DESC
            """)
    List<Ticket> search(
            @Param("requesterId") Long requesterId,
            @Param("attendantId") Long attendantId,
            @Param("status") TicketStatus status,
            @Param("priority") TicketPriority priority,
            @Param("categoryId") Long categoryId,
            @Param("search") String search);
}
