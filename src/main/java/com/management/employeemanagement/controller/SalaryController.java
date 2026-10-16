package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.Salary;
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

    @PostMapping("/organization/{organizationId}/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public Salary addSalary(
            @PathVariable Long organizationId,
            @PathVariable Long employeeId,
            @Valid @RequestBody Salary salary) {

        return salaryService.addSalary(organizationId, employeeId, salary);
    }

    @GetMapping("/organization/{organizationId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public List<Salary> getAllSalary(
            @PathVariable Long organizationId) {

        return salaryService.getAllSalary(organizationId);
    }

    @GetMapping("/organization/{organizationId}/{salaryId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public Salary getSalaryById(
            @PathVariable Long organizationId,
            @PathVariable Long salaryId) {

        return salaryService.getSalaryById(organizationId, salaryId);
    }

    @GetMapping("/organization/{organizationId}/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public List<Salary> getSalaryByEmployeeId(
            @PathVariable Long organizationId,
            @PathVariable Long employeeId) {

        return salaryService.getSalaryByEmployeeId(
                organizationId,
                employeeId
        );
    }

    @PutMapping("/organization/{organizationId}/{salaryId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public Salary updateSalary(
            @PathVariable Long organizationId,
            @PathVariable Long salaryId,
            @Valid @RequestBody Salary salary) {

        return salaryService.updateSalary(
                organizationId,
                salaryId,
                salary
        );
    }

    @DeleteMapping("/organization/{organizationId}/{salaryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteSalary(
            @PathVariable Long organizationId,
            @PathVariable Long salaryId) {

        salaryService.deleteSalary(
                organizationId,
                salaryId
        );

        return "Salary deleted successfully";
    }
}