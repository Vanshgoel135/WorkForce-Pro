package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.Attendance;
import com.management.employeemanagement.security.SecurityUtils;
import com.management.employeemanagement.service.AttendanceService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/checkin/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public Attendance checkIn(@PathVariable Long employeeId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return attendanceService.checkIn(organizationId, employeeId);
    }

    @PostMapping("/checkout/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public Attendance checkOut(@PathVariable Long employeeId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return attendanceService.checkOut(organizationId, employeeId);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public List<Attendance> getAllAttendance() {

        Long organizationId = SecurityUtils.getOrganizationId();

        return attendanceService.getAllAttendance(organizationId);
    }

    @GetMapping("/{attendanceId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public Attendance getAttendanceById(@PathVariable Long attendanceId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return attendanceService.getAttendanceById(
                organizationId,
                attendanceId
        );
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    public List<Attendance> getAttendanceByEmployeeId(
            @PathVariable Long employeeId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return attendanceService.getAttendanceByEmployeeId(
                organizationId,
                employeeId
        );
    }
}