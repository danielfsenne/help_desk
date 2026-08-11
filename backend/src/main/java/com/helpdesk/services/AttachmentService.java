package com.helpdesk.services;

import com.helpdesk.dto.AttachmentResponseDTO;
import com.helpdesk.entities.Attachment;
import com.helpdesk.entities.Ticket;
import com.helpdesk.entities.User;
import com.helpdesk.enums.TicketStatus;
import com.helpdesk.exceptions.BusinessException;
import com.helpdesk.exceptions.ResourceNotFoundException;
import com.helpdesk.repositories.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TicketService ticketService;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public List<AttachmentResponseDTO> findByTicket(Long ticketId, User principal) {
        Ticket ticket = ticketService.findEntityById(ticketId);
        ticketService.checkCanView(ticket, principal);
        return attachmentRepository.findByTicketId(ticketId).stream()
                .map(AttachmentResponseDTO::from)
                .toList();
    }

    @Transactional
    public AttachmentResponseDTO upload(Long ticketId, MultipartFile file, User uploader) {
        Ticket ticket = ticketService.findEntityById(ticketId);
        ticketService.checkCanView(ticket, uploader);

        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new BusinessException("Chamados fechados não podem receber anexos");
        }

        if (file.isEmpty()) {
            throw new BusinessException("Arquivo vazio");
        }

        String storedFileName = fileStorageService.store(file);

        Attachment attachment = Attachment.builder()
                .fileName(file.getOriginalFilename())
                .storedFileName(storedFileName)
                .contentType(file.getContentType())
                .size(file.getSize())
                .ticket(ticket)
                .uploadedBy(uploader)
                .build();

        return AttachmentResponseDTO.from(attachmentRepository.save(attachment));
    }

    @Transactional(readOnly = true)
    public Attachment findForDownload(Long attachmentId, User principal) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Anexo não encontrado: " + attachmentId));
        ticketService.checkCanView(attachment.getTicket(), principal);
        return attachment;
    }
}
