package com.management.employeemanagement.service;

import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.repository.EmployeeRepository;
import com.management.employeemanagement.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElseThrow( ()->
        new ResourceNotFoundException("Employee not found with id " + id));
    }
    public Employee updateEmployee(Long id, Employee employee){
        Employee existingEmployee = employeeRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Employee not found with id " + id));

            existingEmployee.setName(employee.getName());
            existingEmployee.setEmail(employee.getEmail());
            existingEmployee.setDepartment(employee.getDepartment());
            existingEmployee.setSalary(employee.getSalary());
            existingEmployee.setDateOfJoining(employee.getDateOfJoining());

            return employeeRepository.save(existingEmployee);
        }
    public String deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id " + id));

        employeeRepository.delete(employee);

        return "Employee Deleted Successfully";
    }
    public Page<Employee> getEmployees(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return employeeRepository.findAll(pageable);
    }
    public List<Employee> sortEmployees(String field) {

        return employeeRepository.findAll(Sort.by(field));
    }
    public List<Employee> searchByName(String name) {
        return employeeRepository.findByName(name);
    }
}


