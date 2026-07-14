package com.management.employeemanagement.service;

import com.management.employeemanagement.entity.Department;
import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.exception.ResourceNotFoundException;
import com.management.employeemanagement.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    public DepartmentService(DepartmentRepository departmentRepository){
        this.departmentRepository=departmentRepository;
    }
    public Department saveDepartment(Department department){
        return departmentRepository.save(department);
    }
    public List<Department> getAllDepartment(){
        return departmentRepository.findAll();
    }
    public Department getDepartmentById(Long id){
        return departmentRepository.findById(id).orElseThrow( ()->
                new ResourceNotFoundException("Employee not found with id " + id));
    }
    public Department updateDepartment(Long id, Department department){
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found with id " + id));
        existingDepartment.setName(department.getName());
        existingDepartment.setDescription(department.getDescription());
        existingDepartment.setCreatedAt(department.getCreatedAt());
        return departmentRepository.save(existingDepartment);
    }
    public Department deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found with id " + id));

        departmentRepository.delete(department);
        return department;
    }
}
