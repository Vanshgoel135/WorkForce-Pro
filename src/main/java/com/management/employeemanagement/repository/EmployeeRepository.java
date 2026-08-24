package com.management.employeemanagement.repository;

import com.management.employeemanagement.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByName(String name);
    Optional<Employee> findByUsername(String username);
}
