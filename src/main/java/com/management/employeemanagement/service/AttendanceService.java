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

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             EmployeeRepository employeeRepository) {

        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    public Attendance checkIn(Long employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        Attendance attendance = new Attendance();

        attendance.setEmployee(employee);
        attendance.setDate(LocalDate.now());
        attendance.setCheckIn(LocalTime.now());
        attendance.setStatus("Present");

        return attendanceRepository.save(attendance);
    }
    public Attendance checkOut(Long employeeId) {

        Attendance attendance = attendanceRepository
                .findByEmployeeIdAndDate(employeeId, LocalDate.now())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Check-In not found"));

        attendance.setCheckOut(LocalTime.now());

        return attendanceRepository.save(attendance);
    }
    public List<Attendance> getAllAttendance(){
        return attendanceRepository.findAll();
    }
    public Attendance getAttendanceById(Long id){
        return attendanceRepository.findById(id).orElseThrow( ()->
                new ResourceNotFoundException("Attendance not found with id " + id));
    }
    public List<Attendance> getAttendanceByEmployeeId(Long employeeId){
        attendanceRepository.findById(employeeId).orElseThrow(()-> new ResourceNotFoundException("Employee noy found"));
        return attendanceRepository.findByEmployeeId(employeeId);
    }
}