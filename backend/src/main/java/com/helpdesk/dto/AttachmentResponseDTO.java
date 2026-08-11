package com.helpdesk.dto;

import com.helpdesk.entities.Attachment;

import java.time.Instant;

public record AttachmentResponseDTO(
        Long id,
        String fileName,
        String contentType,
        long size,
        Instant createdAt,
        UserResponseDTO uploadedBy
) {

    public static AttachmentResponseDTO from(Attachment attachment) {
        return new AttachmentResponseDTO(
                attachment.getId(),
                attachment.getFileName(),
                attachment.getContentType(),
                attachment.getSize(),
                attachment.getCreatedAt(),
                UserResponseDTO.from(attachment.getUploadedBy())
        );
    }
}
