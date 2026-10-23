package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.Department;
import com.management.employeemanagement.security.SecurityUtils;
import com.management.employeemanagement.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

  private final DepartmentService departmentService;

  public DepartmentController(DepartmentService departmentService) {
    this.departmentService = departmentService;
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('ADMIN','HR')")
  public Department addDepartment(
          @Valid @RequestBody Department department) {

    Long organizationId = SecurityUtils.getOrganizationId();

    return departmentService.saveDepartment(
            organizationId,
            department
    );
  }

  @GetMapping
  @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
  public List<Department> getAllDepartment() {

    Long organizationId = SecurityUtils.getOrganizationId();

    return departmentService.getAllDepartment(organizationId);
  }

  @GetMapping("/{departmentId}")
  @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
  public Department getDepartmentById(
          @PathVariable Long departmentId) {

    Long organizationId = SecurityUtils.getOrganizationId();

    return departmentService.getDepartmentById(
            organizationId,
            departmentId
    );
  }

  @PutMapping("/{departmentId}")
  @PreAuthorize("hasAnyRole('ADMIN','HR')")
  public Department updateDepartment(
          @PathVariable Long departmentId,
          @Valid @RequestBody Department department) {

    Long organizationId = SecurityUtils.getOrganizationId();

    return departmentService.updateDepartment(
            organizationId,
            departmentId,
            department
    );
  }

  @DeleteMapping("/{departmentId}")
  @PreAuthorize("hasRole('ADMIN')")
  public Department deleteDepartment(
          @PathVariable Long departmentId) {

    Long organizationId = SecurityUtils.getOrganizationId();

    return departmentService.deleteDepartment(
            organizationId,
            departmentId
    );
  }
}