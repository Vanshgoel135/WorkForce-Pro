package com.management.employeemanagement.repository;

import com.management.employeemanagement.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

}