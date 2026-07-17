package com.management.employeemanagement.service;

import com.management.employeemanagement.exception.ResourceNotFoundException;
import com.management.employeemanagement.repository.SalaryRepository;
import org.springframework.stereotype.Service;
import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.entity.Salary;
import com.management.employeemanagement.repository.EmployeeRepository;
import java.util.List;
@Service
public class SalaryService {

    private final SalaryRepository salaryRepository;
    private final EmployeeRepository employeeRepository;

    public SalaryService(SalaryRepository salaryRepository,
                         EmployeeRepository employeeRepository) {
        this.salaryRepository = salaryRepository;
        this.employeeRepository = employeeRepository;
    }

    public Salary addSalary(Long employeeId, Salary salary) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        salary.setEmployee(employee);

        double netSalary = salary.getBasicSalary()
                + salary.getBonus()
                - salary.getDeduction();

        salary.setNetSalary(netSalary);

        return salaryRepository.save(salary);
    }
    public List<Salary> getAllSalary(){
        return salaryRepository.findAll();
    }
    public Salary getSalaryById(Long id){
        return salaryRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Salary not found"));
    }
    public List<Salary> getSalaryByEmployeeId(Long employeeId) {
        return salaryRepository.findByEmployeeId(employeeId);
    }
    public Salary updateSalary(Long id,Salary salary){
        Salary existingSalary = salaryRepository.findById(id)
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
    public void deleteSalary(Long id) {

        Salary salary = salaryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Salary not found"));

        salaryRepository.delete(salary);
    }
}