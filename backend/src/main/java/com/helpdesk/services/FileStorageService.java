package com.helpdesk.services;

import com.helpdesk.exceptions.BusinessException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path root;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível criar o diretório de uploads", e);
        }
    }

    public String store(MultipartFile file) {
        String extension = "";
        String originalName = file.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf('.'));
        }

        String storedFileName = UUID.randomUUID() + extension;

        try {
            Files.copy(file.getInputStream(), root.resolve(storedFileName));
        } catch (IOException e) {
            throw new BusinessException("Não foi possível salvar o arquivo");
        }

        return storedFileName;
    }

    public InputStream load(String storedFileName) {
        try {
            return Files.newInputStream(root.resolve(storedFileName));
        } catch (IOException e) {
            throw new BusinessException("Não foi possível ler o arquivo");
        }
    }
}
