package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.LeaveRequest;
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

    @PostMapping("/organization/{organizationId}/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public LeaveRequest applyLeave(
            @PathVariable Long organizationId,
            @PathVariable Long employeeId,
            @Valid @RequestBody LeaveRequest leaveRequest) {

        return leaveRequestService.applyLeave(
                organizationId,
                employeeId,
                leaveRequest
        );
    }

    @GetMapping("/organization/{organizationId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public List<LeaveRequest> getAllLeaveRequest(
            @PathVariable Long organizationId) {

        return leaveRequestService.getAllLeaveRequest(organizationId);
    }

    @GetMapping("/organization/{organizationId}/{leaveId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public LeaveRequest getLeaveById(
            @PathVariable Long organizationId,
            @PathVariable Long leaveId) {

        return leaveRequestService.getLeaveById(
                organizationId,
                leaveId
        );
    }

    @PutMapping("/organization/{organizationId}/approve/{leaveId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public LeaveRequest approveLeave(
            @PathVariable Long organizationId,
            @PathVariable Long leaveId) {

        return leaveRequestService.approveLeave(
                organizationId,
                leaveId
        );
    }

    @PutMapping("/organization/{organizationId}/reject/{leaveId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public LeaveRequest rejectLeave(
            @PathVariable Long organizationId,
            @PathVariable Long leaveId) {

        return leaveRequestService.rejectLeave(
                organizationId,
                leaveId
        );
    }

    @GetMapping("/organization/{organizationId}/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public List<LeaveRequest> getLeaveByEmployeeId(
            @PathVariable Long organizationId,
            @PathVariable Long employeeId) {

        return leaveRequestService.getLeaveByEmployeeId(
                organizationId,
                employeeId
        );
    }
}