package com.helpdesk.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CommentRequestDTO(

        @NotBlank(message = "mensagem é obrigatória")
        String message,

        @NotNull(message = "autor é obrigatório")
        Long authorId
) {
}
