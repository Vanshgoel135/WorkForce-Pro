package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.entity.LeaveRequest;
import com.management.employeemanagement.service.LeaveRequestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/LeaveRequest")
public class LeaveRequestController {
    private final LeaveRequestService leaveRequestService;
    public LeaveRequestController(LeaveRequestService leaveRequestService){
        this.leaveRequestService=leaveRequestService;
    }
    @PostMapping("/apply/{employeeId}")
    public LeaveRequest applyLeave(@PathVariable Long employeeId, @Valid LeaveRequest leaveRequest){
        return leaveRequestService.applyLeave(employeeId,leaveRequest);
    }
}
