package com.management.employeemanagement.repository;

import com.management.employeemanagement.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

}
