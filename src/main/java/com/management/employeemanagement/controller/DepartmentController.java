package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.Department;
import com.management.employeemanagement.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/department")
public class DepartmentController {

  private final DepartmentService departmentService;

  public DepartmentController(DepartmentService departmentService) {
    this.departmentService = departmentService;
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('ADMIN','HR')")
  public Department addDepartment(@Valid @RequestBody Department department) {
    return departmentService.saveDepartment(department);
  }

  @GetMapping

  @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
  public List<Department> getAllDepartment() {
    return departmentService.getAllDepartment();
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
  public Department getDepartmentById(@PathVariable Long id) {
    return departmentService.getDepartmentById(id);
  }
  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN','HR')")
  public Department updateDepartment(@Valid @PathVariable Long id,@RequestBody Department department){
    return departmentService.updateDepartment(id,department);
  }
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public Department deleteDepartment(@PathVariable Long id){
    return departmentService.deleteDepartment(id);
  }
}