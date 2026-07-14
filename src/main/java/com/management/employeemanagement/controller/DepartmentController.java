package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.Department;
import com.management.employeemanagement.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/department")
public class DepartmentController {

  private final DepartmentService departmentService;

  public DepartmentController(DepartmentService departmentService) {
    this.departmentService = departmentService;
  }

  @PostMapping
  public Department addDepartment(@Valid @RequestBody Department department) {
    return departmentService.saveDepartment(department);
  }

  @GetMapping
  public List<Department> getAllDepartment() {
    return departmentService.getAllDepartment();
  }

  @GetMapping("/{id}")
  public Department getDepartmentById(@PathVariable Long id) {
    return departmentService.getDepartmentById(id);
  }
  @PutMapping("/{id}")
  public Department updateDepartment(@Valid @PathVariable Long id,@RequestBody Department department){
    return departmentService.updateDepartment(id,department);
  }
  @DeleteMapping("/{id}")
  public Department deleteDepartment(@PathVariable Long id){
    return departmentService.deleteDepartment(id);
  }
}