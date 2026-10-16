package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.Department;
import com.management.employeemanagement.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/organizations/{organizationId}/departments")
public class DepartmentController {

  private final DepartmentService departmentService;

  public DepartmentController(DepartmentService departmentService) {
    this.departmentService = departmentService;
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('ADMIN','HR')")
  public Department addDepartment(
          @PathVariable Long organizationId,
          @Valid @RequestBody Department department) {

    return departmentService.saveDepartment(organizationId, department);
  }

  @GetMapping
  @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
  public List<Department> getAllDepartment(
          @PathVariable Long organizationId) {

    return departmentService.getAllDepartment(organizationId);
  }

  @GetMapping("/{departmentId}")
  @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
  public Department getDepartmentById(
          @PathVariable Long organizationId,
          @PathVariable Long departmentId) {

    return departmentService.getDepartmentById(organizationId, departmentId);
  }

  @PutMapping("/{departmentId}")
  @PreAuthorize("hasAnyRole('ADMIN','HR')")
  public Department updateDepartment(
          @PathVariable Long organizationId,
          @PathVariable Long departmentId,
          @Valid @RequestBody Department department) {

    return departmentService.updateDepartment(
            organizationId,
            departmentId,
            department
    );
  }

  @DeleteMapping("/{departmentId}")
  @PreAuthorize("hasRole('ADMIN')")
  public Department deleteDepartment(
          @PathVariable Long organizationId,
          @PathVariable Long departmentId) {

    return departmentService.deleteDepartment(
            organizationId,
            departmentId
    );
  }
}