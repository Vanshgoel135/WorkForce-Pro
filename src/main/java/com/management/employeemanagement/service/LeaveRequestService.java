package com.management.employeemanagement.service;

import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.entity.LeaveRequest;
import com.management.employeemanagement.exception.ResourceNotFoundException;
import com.management.employeemanagement.repository.EmployeeRepository;
import com.management.employeemanagement.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveRequestService(
            LeaveRequestRepository leaveRequestRepository,
            EmployeeRepository employeeRepository) {

        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
    }

    // Apply Leave
    public LeaveRequest applyLeave(Long organizationId,
                                   Long employeeId,
                                   LeaveRequest leaveRequest) {

        Employee employee = employeeRepository
                .findByIdAndOrganizationId(employeeId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        leaveRequest.setEmployee(employee);
        leaveRequest.setStatus("Pending");

        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> getAllLeaveRequest(Long organizationId) {

        return leaveRequestRepository.findByEmployeeOrganizationId(
                organizationId
        );
    }

    public LeaveRequest getLeaveById(Long organizationId,
                                     Long leaveId) {

        return leaveRequestRepository
                .findByIdAndEmployeeOrganizationId(
                        leaveId,
                        organizationId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Leave Request not found"));
    }

    public LeaveRequest approveLeave(Long organizationId,
                                     Long leaveId) {

        LeaveRequest leave = leaveRequestRepository
                .findByIdAndEmployeeOrganizationId(
                        leaveId,
                        organizationId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Leave Request not found"));

        leave.setStatus("Approved");

        return leaveRequestRepository.save(leave);
    }

    public LeaveRequest rejectLeave(Long organizationId,
                                    Long leaveId) {

        LeaveRequest leave = leaveRequestRepository
                .findByIdAndEmployeeOrganizationId(
                        leaveId,
                        organizationId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Leave Request not found"));

        leave.setStatus("Rejected");

        return leaveRequestRepository.save(leave);
    }

    public List<LeaveRequest> getLeaveByEmployeeId(Long organizationId,
                                                   Long employeeId) {

        employeeRepository
                .findByIdAndOrganizationId(employeeId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        return leaveRequestRepository
                .findByEmployeeIdAndEmployeeOrganizationId(
                        employeeId,
                        organizationId
                );
    }
}