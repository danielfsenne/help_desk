package com.helpdesk.controllers;

import com.helpdesk.dto.ReportSummaryDTO;
import com.helpdesk.services.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ReportSummaryDTO summary() {
        return reportService.summary();
    }
}
