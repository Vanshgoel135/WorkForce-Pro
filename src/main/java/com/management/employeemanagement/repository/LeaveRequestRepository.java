package com.management.employeemanagement.repository;

import com.management.employeemanagement.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeOrganizationId(Long organizationId);

    Optional<LeaveRequest> findByIdAndEmployeeOrganizationId(
            Long leaveId,
            Long organizationId
    );

    List<LeaveRequest> findByEmployeeIdAndEmployeeOrganizationId(
            Long employeeId,
            Long organizationId
    );
    long countByEmployeeOrganizationId(Long organizationId);
}