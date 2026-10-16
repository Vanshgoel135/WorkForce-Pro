package com.management.employeemanagement.controller;

import com.management.employeemanagement.dto.DashboardDTO;
import com.management.employeemanagement.service.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping("/organization/{organizationId}")
    public DashboardDTO getDashboard(
            @PathVariable Long organizationId) {

        return dashboardService.getDashboard(organizationId);
    }
}