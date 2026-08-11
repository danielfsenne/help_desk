package com.helpdesk.services;

import com.helpdesk.dto.CategoryRequestDTO;
import com.helpdesk.dto.CategoryResponseDTO;
import com.helpdesk.entities.Category;
import com.helpdesk.exceptions.BusinessException;
import com.helpdesk.exceptions.ResourceNotFoundException;
import com.helpdesk.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(CategoryResponseDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponseDTO findById(Long id) {
        return CategoryResponseDTO.from(findEntityById(id));
    }

    @Transactional
    public CategoryResponseDTO create(CategoryRequestDTO dto) {
        if (categoryRepository.existsByName(dto.name())) {
            throw new BusinessException("Já existe uma categoria com esse nome");
        }

        Category category = Category.builder()
                .name(dto.name())
                .description(dto.description())
                .build();

        return CategoryResponseDTO.from(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponseDTO update(Long id, CategoryRequestDTO dto) {
        Category category = findEntityById(id);
        category.setName(dto.name());
        category.setDescription(dto.description());
        return CategoryResponseDTO.from(category);
    }

    @Transactional
    public void delete(Long id) {
        Category category = findEntityById(id);
        categoryRepository.delete(category);
    }

    private Category findEntityById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada: " + id));
    }
}
