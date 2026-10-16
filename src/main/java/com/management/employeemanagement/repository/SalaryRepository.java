package com.management.employeemanagement.repository;

import com.management.employeemanagement.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SalaryRepository extends JpaRepository<Salary, Long> {

    List<Salary> findByEmployeeId(Long employeeId);

    List<Salary> findByEmployeeOrganizationId(Long organizationId);

    List<Salary> findByEmployeeIdAndEmployeeOrganizationId(
            Long employeeId,
            Long organizationId
    );

    Optional<Salary> findByIdAndEmployeeOrganizationId(
            Long salaryId,
            Long organizationId
    );
}