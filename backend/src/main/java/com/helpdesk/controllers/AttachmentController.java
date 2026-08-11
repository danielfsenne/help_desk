package com.helpdesk.controllers;

import com.helpdesk.entities.Attachment;
import com.helpdesk.security.UserPrincipal;
import com.helpdesk.services.AttachmentService;
import com.helpdesk.services.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;
    private final FileStorageService fileStorageService;

    @GetMapping("/{id}")
    public ResponseEntity<InputStreamResource> download(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        Attachment attachment = attachmentService.findForDownload(id, principal.getUser());
        InputStreamResource resource = new InputStreamResource(fileStorageService.load(attachment.getStoredFileName()));

        MediaType mediaType = attachment.getContentType() != null
                ? MediaType.parseMediaType(attachment.getContentType())
                : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(attachment.getFileName()).build().toString())
                .body(resource);
    }
}
