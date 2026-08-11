package com.helpdesk.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequestDTO(

        @NotBlank(message = "nome é obrigatório")
        String name,

        String description
) {
}
