package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.entity.LeaveRequest;
import com.management.employeemanagement.service.LeaveRequestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/LeaveRequest")
public class LeaveRequestController {
    private final LeaveRequestService leaveRequestService;
    public LeaveRequestController(LeaveRequestService leaveRequestService){
        this.leaveRequestService=leaveRequestService;
    }
    @PostMapping("/apply/{employeeId}")
    public LeaveRequest applyLeave(@PathVariable Long employeeId, @Valid @RequestBody  LeaveRequest leaveRequest){
        return leaveRequestService.applyLeave(employeeId,leaveRequest);
    }
    @GetMapping
    public List<LeaveRequest> getAllLeaveRequest(){
        return leaveRequestService.getAllLeaveRequest();
    }
    @GetMapping("/{id}")
    public LeaveRequest getLeaveById(@PathVariable Long id){
        return leaveRequestService.getLeaveById(id);
    }
    @PutMapping("/approve/{id}")
            public LeaveRequest approveLeave(@PathVariable Long id){
        return leaveRequestService.approveLeave(id);
    }
    @PutMapping("/rejected/{id}")
    public LeaveRequest rejectLeave(@PathVariable Long id){
        return leaveRequestService.rejectLeave(id);
    }
    @GetMapping("/employee/{employeeId}")
    public List<LeaveRequest> getLeaveByEmployeeId(@PathVariable Long  employeeId){
        return leaveRequestService.getLeaveByEmployeeId(employeeId);
    }
}
