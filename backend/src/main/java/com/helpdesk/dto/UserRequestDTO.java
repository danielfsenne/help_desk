package com.helpdesk.dto;

import com.helpdesk.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRequestDTO(

        @NotBlank(message = "nome é obrigatório")
        String name,

        @NotBlank(message = "email é obrigatório")
        @Email(message = "email inválido")
        String email,

        @NotBlank(message = "senha é obrigatória")
        @Size(min = 6, message = "senha deve ter ao menos 6 caracteres")
        String password,

        @NotNull(message = "perfil é obrigatório")
        Role role
) {
}
