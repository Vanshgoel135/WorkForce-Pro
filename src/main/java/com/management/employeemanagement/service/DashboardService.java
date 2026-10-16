package com.management.employeemanagement.service;

import com.management.employeemanagement.dto.DashboardDTO;
import com.management.employeemanagement.entity.Salary;
import com.management.employeemanagement.repository.*;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final SalaryRepository salaryRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public DashboardService(
            EmployeeRepository employeeRepository,
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

    public DashboardDTO getDashboard(Long organizationId) {

        DashboardDTO dashboard = new DashboardDTO();

        dashboard.setTotalEmployees(
                employeeRepository.countByOrganizationId(organizationId)
        );

        dashboard.setTotalDepartments(
                departmentRepository.countByOrganizationId(organizationId)
        );

        dashboard.setPresentToday(
                attendanceRepository.countByEmployeeOrganizationId(organizationId)
        );

        dashboard.setOnLeave(
                leaveRequestRepository.countByEmployeeOrganizationId(organizationId)
        );

        double totalSalary = salaryRepository
                .findByEmployeeOrganizationId(organizationId)
                .stream()
                .mapToDouble(Salary::getNetSalary)
                .sum();

        dashboard.setTotalSalary(totalSalary);

        return dashboard;
    }
}