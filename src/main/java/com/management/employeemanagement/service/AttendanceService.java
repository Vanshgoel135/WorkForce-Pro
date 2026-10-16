package com.management.employeemanagement.service;
import com.management.employeemanagement.entity.Attendance;
import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.exception.ResourceNotFoundException;
import com.management.employeemanagement.repository.AttendanceRepository;
import com.management.employeemanagement.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import com.management.employeemanagement.entity.Organization;
import com.management.employeemanagement.repository.OrganizationRepository;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    private final OrganizationRepository organizationRepository;
    public AttendanceService(
            AttendanceRepository attendanceRepository,
            EmployeeRepository employeeRepository,
            OrganizationRepository organizationRepository) {

        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
        this.organizationRepository = organizationRepository;
    }
    public Attendance checkIn(Long organizationId, Long employeeId) {

        Employee employee = employeeRepository
                .findByIdAndOrganizationId(employeeId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        Attendance attendance = new Attendance();

        attendance.setEmployee(employee);
        attendance.setDate(LocalDate.now());
        attendance.setCheckIn(LocalTime.now());
        attendance.setStatus("Present");

        return attendanceRepository.save(attendance);
    }
    public Attendance checkOut(Long organizationId, Long employeeId) {

        Attendance attendance = attendanceRepository
                .findByEmployeeIdAndOrganizationIdAndDate(
                        employeeId,
                        organizationId,
                        LocalDate.now())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Check-In not found"));

        attendance.setCheckOut(LocalTime.now());

        return attendanceRepository.save(attendance);
    }
    public List<Attendance> getAllAttendance(Long organizationId) {

        return attendanceRepository.findByOrganizationId(organizationId);
    }
    public Attendance getAttendanceById(Long organizationId, Long attendanceId) {

        return attendanceRepository
                .findByIdAndOrganizationId(attendanceId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Attendance not found"));
    }
    public List<Attendance> getAttendanceByEmployeeId(
            Long organizationId,
            Long employeeId) {

        employeeRepository
                .findByIdAndOrganizationId(employeeId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        return attendanceRepository
                .findByEmployeeIdAndOrganizationId(
                        employeeId,
                        organizationId);
    }
}