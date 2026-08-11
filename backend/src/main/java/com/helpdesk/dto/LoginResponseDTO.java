package com.helpdesk.dto;

public record LoginResponseDTO(
        String token,
        UserResponseDTO user
) {
}
