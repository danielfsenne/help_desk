package com.helpdesk.dto;

import com.helpdesk.entities.Category;

public record CategoryResponseDTO(
        Long id,
        String name,
        String description
) {

    public static CategoryResponseDTO from(Category category) {
        return new CategoryResponseDTO(category.getId(), category.getName(), category.getDescription());
    }
}
