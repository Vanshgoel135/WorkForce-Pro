package com.management.employeemanagement.service;

import com.management.employeemanagement.exception.ResourceNotFoundException;
import com.management.employeemanagement.repository.SalaryRepository;
import org.springframework.stereotype.Service;
import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.entity.Salary;
import com.management.employeemanagement.repository.EmployeeRepository;
import java.util.List;
import com.management.employeemanagement.repository.OrganizationRepository;
@Service
public class SalaryService {

    private final SalaryRepository salaryRepository;
    private final EmployeeRepository employeeRepository;

    public SalaryService(
            SalaryRepository salaryRepository,
            EmployeeRepository employeeRepository) {

        this.salaryRepository = salaryRepository;
        this.employeeRepository = employeeRepository;
    }

    public Salary addSalary(Long organizationId, Long employeeId, Salary salary) {

        Employee employee = employeeRepository
                .findByIdAndOrganizationId(employeeId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        salary.setEmployee(employee);

        double netSalary = salary.getBasicSalary()
                + salary.getBonus()
                - salary.getDeduction();

        salary.setNetSalary(netSalary);

        return salaryRepository.save(salary);
    }
    public List<Salary> getAllSalary(Long organizationId) {

        return salaryRepository.findByEmployeeOrganizationId(organizationId);
    }
    public Salary getSalaryById(Long organizationId, Long salaryId) {

        return salaryRepository
                .findByIdAndEmployeeOrganizationId(salaryId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Salary not found"));
    }
    public List<Salary> getSalaryByEmployeeId(Long organizationId,
                                              Long employeeId) {

        employeeRepository.findByIdAndOrganizationId(employeeId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        return salaryRepository.findByEmployeeIdAndEmployeeOrganizationId(
                employeeId,
                organizationId
        );
    }

    public Salary updateSalary(Long organizationId,
                               Long salaryId,
                               Salary salary) {

        Salary existingSalary = salaryRepository
                .findByIdAndEmployeeOrganizationId(
                        salaryId,
                        organizationId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Salary not found"));

        existingSalary.setBasicSalary(salary.getBasicSalary());
        existingSalary.setBonus(salary.getBonus());
        existingSalary.setDeduction(salary.getDeduction());
        existingSalary.setPayDate(salary.getPayDate());

        double netSalary = salary.getBasicSalary()
                + salary.getBonus()
                - salary.getDeduction();

        existingSalary.setNetSalary(netSalary);

        return salaryRepository.save(existingSalary);
    }
    public void deleteSalary(Long organizationId, Long salaryId) {

        Salary salary = salaryRepository
                .findByIdAndEmployeeOrganizationId(
                        salaryId,
                        organizationId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Salary not found"));

        salaryRepository.delete(salary);
    }
    }