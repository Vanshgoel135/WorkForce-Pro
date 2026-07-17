package com.management.employeemanagement.repository;

import com.management.employeemanagement.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SalaryRepository extends JpaRepository<Salary, Long> {
    List<Salary> findByEmployeeId(Long employeeId);
}