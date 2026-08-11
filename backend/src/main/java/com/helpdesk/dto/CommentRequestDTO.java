package com.helpdesk.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentRequestDTO(

        @NotBlank(message = "mensagem é obrigatória")
        String message
) {
}
