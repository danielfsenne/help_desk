package com.helpdesk.dto;

import com.helpdesk.entities.User;
import com.helpdesk.enums.Role;

import java.time.Instant;

public record UserResponseDTO(
        Long id,
        String name,
        String email,
        Role role,
        Instant createdAt
) {

    public static UserResponseDTO from(User user) {
        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }
}
