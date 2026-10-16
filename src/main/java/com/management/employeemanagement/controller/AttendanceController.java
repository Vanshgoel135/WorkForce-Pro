package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.Attendance;
import com.management.employeemanagement.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/organizations/{organizationId}/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/checkin/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public Attendance checkIn(
            @PathVariable Long organizationId,
            @PathVariable Long employeeId) {

        return attendanceService.checkIn(organizationId, employeeId);
    }

    @PostMapping("/checkout/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public Attendance checkOut(
            @PathVariable Long organizationId,
            @PathVariable Long employeeId) {

        return attendanceService.checkOut(organizationId, employeeId);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public List<Attendance> getAllAttendance(
            @PathVariable Long organizationId) {

        return attendanceService.getAllAttendance(organizationId);
    }

    @GetMapping("/{attendanceId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public Attendance getAttendanceById(
            @PathVariable Long organizationId,
            @PathVariable Long attendanceId) {

        return attendanceService.getAttendanceById(
                organizationId,
                attendanceId
        );
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public List<Attendance> getAttendanceByEmployeeId(
            @PathVariable Long organizationId,
            @PathVariable Long employeeId) {

        return attendanceService.getAttendanceByEmployeeId(
                organizationId,
                employeeId
        );
    }
}