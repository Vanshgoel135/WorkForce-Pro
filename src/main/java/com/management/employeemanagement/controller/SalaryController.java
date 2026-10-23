package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.Salary;
import com.management.employeemanagement.security.SecurityUtils;
import com.management.employeemanagement.service.SalaryService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/salary")
public class SalaryController {

    private final SalaryService salaryService;

    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @PostMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public Salary addSalary(
            @PathVariable Long employeeId,
            @Valid @RequestBody Salary salary) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return salaryService.addSalary(
                organizationId,
                employeeId,
                salary
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public List<Salary> getAllSalary() {

        Long organizationId = SecurityUtils.getOrganizationId();

        return salaryService.getAllSalary(organizationId);
    }

    @GetMapping("/{salaryId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public Salary getSalaryById(
            @PathVariable Long salaryId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return salaryService.getSalaryById(
                organizationId,
                salaryId
        );
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public List<Salary> getSalaryByEmployeeId(
            @PathVariable Long employeeId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return salaryService.getSalaryByEmployeeId(
                organizationId,
                employeeId
        );
    }

    @PutMapping("/{salaryId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public Salary updateSalary(
            @PathVariable Long salaryId,
            @Valid @RequestBody Salary salary) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return salaryService.updateSalary(
                organizationId,
                salaryId,
                salary
        );
    }

    @DeleteMapping("/{salaryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteSalary(
            @PathVariable Long salaryId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        salaryService.deleteSalary(
                organizationId,
                salaryId
        );

        return "Salary deleted successfully";
    }
}