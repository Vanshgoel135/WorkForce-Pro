package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.LeaveRequest;
import com.management.employeemanagement.security.SecurityUtils;
import com.management.employeemanagement.service.LeaveRequestService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public LeaveRequest applyLeave(
            @PathVariable Long employeeId,
            @Valid @RequestBody LeaveRequest leaveRequest) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return leaveRequestService.applyLeave(
                organizationId,
                employeeId,
                leaveRequest
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public List<LeaveRequest> getAllLeaveRequest() {

        Long organizationId = SecurityUtils.getOrganizationId();

        return leaveRequestService.getAllLeaveRequest(organizationId);
    }

    @GetMapping("/{leaveId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public LeaveRequest getLeaveById(
            @PathVariable Long leaveId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return leaveRequestService.getLeaveById(
                organizationId,
                leaveId
        );
    }

    @PutMapping("/approve/{leaveId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public LeaveRequest approveLeave(
            @PathVariable Long leaveId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return leaveRequestService.approveLeave(
                organizationId,
                leaveId
        );
    }

    @PutMapping("/reject/{leaveId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public LeaveRequest rejectLeave(
            @PathVariable Long leaveId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return leaveRequestService.rejectLeave(
                organizationId,
                leaveId
        );
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public List<LeaveRequest> getLeaveByEmployeeId(
            @PathVariable Long employeeId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return leaveRequestService.getLeaveByEmployeeId(
                organizationId,
                employeeId
        );
    }
}