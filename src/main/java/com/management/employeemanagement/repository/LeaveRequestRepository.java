package com.management.employeemanagement.repository;

import com.management.employeemanagement.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

}