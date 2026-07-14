package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.Attendance;
import com.management.employeemanagement.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/attendance")
public class AttendanceController {
    private final AttendanceService attendanceService;
    public AttendanceController(AttendanceService attendanceService){
        this.attendanceService=attendanceService;
    }
    @PostMapping("/checkin/{employeeId}")
    public Attendance checkIn(@PathVariable Long employeeId) {
        return attendanceService.checkIn(employeeId);
    }
    @PostMapping("/checkOut/{employeeId}")
    public Attendance checkOut(@PathVariable Long employeeId){
        return attendanceService.checkOut(employeeId);
    }
    @GetMapping
    public List<Attendance> getAllAttendance(){
        return attendanceService.getAllAttendance();
    }
    @GetMapping("/{id}")
    public Attendance getAttendanceById(@PathVariable Long id){
        return attendanceService.getAttendanceById(id);
    }
    @GetMapping("/employee/{employeeId}")
    public List<Attendance >getAttendanceByEmployeeId(@PathVariable Long employeeId){
        return attendanceService.getAttendanceByEmployeeId(employeeId);
    }
}
