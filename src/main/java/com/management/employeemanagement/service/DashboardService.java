package com.management.employeemanagement.service;

import com.management.employeemanagement.repository.*;
import org.springframework.stereotype.Service;
import com.management.employeemanagement.dto.DashboardDTO;
import com.management.employeemanagement.entity.Salary;
@Service
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final SalaryRepository salaryRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public DashboardService(EmployeeRepository employeeRepository,
                            DepartmentRepository departmentRepository,
                            AttendanceRepository attendanceRepository,
                            SalaryRepository salaryRepository,
                            LeaveRequestRepository leaveRequestRepository) {

        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.salaryRepository = salaryRepository;
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public DashboardDTO getDashboard() {

        DashboardDTO dashboard = new DashboardDTO();

        dashboard.setTotalEmployees(employeeRepository.count());
        dashboard.setTotalDepartments(departmentRepository.count());
        dashboard.setPresentToday(attendanceRepository.count());
        dashboard.setOnLeave(leaveRequestRepository.count());

        double totalSalary = salaryRepository.findAll()
                .stream()
                .mapToDouble(Salary::getNetSalary)
                .sum();

        dashboard.setTotalSalary(totalSalary);

        return dashboard;
    }
}