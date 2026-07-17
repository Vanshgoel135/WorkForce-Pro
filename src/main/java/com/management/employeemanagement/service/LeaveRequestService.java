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

    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository,
                               EmployeeRepository employeeRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
    }

    // Apply Leave
    public LeaveRequest applyLeave(Long employeeId, LeaveRequest leaveRequest) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id " + employeeId));

        leaveRequest.setEmployee(employee);
        leaveRequest.setStatus("Pending");

        return leaveRequestRepository.save(leaveRequest);
    }
    public List <LeaveRequest> getAllLeaveRequest(){
        return leaveRequestRepository.findAll();
    }
    public LeaveRequest getLeaveById(Long id){
        return leaveRequestRepository.findById(id).orElseThrow(()->
                new ResourceNotFoundException("Leave Request Not Found"));
    }
    public LeaveRequest approveLeave(Long id){
        LeaveRequest leave= leaveRequestRepository.findById(id).orElseThrow(()->
                new ResourceNotFoundException("Approve Leave "));
        leave.setStatus("Approve");
        return leaveRequestRepository.save(leave);
    }
    public LeaveRequest rejectLeave(Long id){
        LeaveRequest leave = leaveRequestRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("5Rejected Leave"));
        leave.setStatus("Rejected");
        return leaveRequestRepository.save(leave);
    }
    public List<LeaveRequest> getLeaveByEmployeeId(Long employeeId){
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }
}