package com.management.employeemanagement.repository;

import com.management.employeemanagement.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByName(String name);

    Optional<Employee> findByEmail(String email);

    // Multi-tenant methods
    List<Employee> findByOrganizationId(Long organizationId);
    long countByOrganizationId(Long organizationId);
    Optional<Employee> findByIdAndOrganizationId(Long id, Long organizationId);

    Page<Employee> findByOrganizationId(Long organizationId, Pageable pageable);

    List<Employee> findByOrganizationId(Long organizationId, Sort sort);

    List<Employee> findByNameAndOrganizationId(String name, Long organizationId);
}