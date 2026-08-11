package com.helpdesk.dto;

import com.helpdesk.entities.Comment;

import java.time.Instant;

public record CommentResponseDTO(
        Long id,
        String message,
        Instant createdAt,
        UserResponseDTO author
) {

    public static CommentResponseDTO from(Comment comment) {
        return new CommentResponseDTO(
                comment.getId(),
                comment.getMessage(),
                comment.getCreatedAt(),
                UserResponseDTO.from(comment.getAuthor())
        );
    }
}
