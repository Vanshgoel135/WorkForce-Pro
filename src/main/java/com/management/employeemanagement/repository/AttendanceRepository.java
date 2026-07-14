package com.management.employeemanagement.repository;

import com.management.employeemanagement.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);
    List<Attendance> findByEmployeeId(Long employeeId);
}
