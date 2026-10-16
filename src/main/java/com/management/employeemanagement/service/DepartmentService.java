package com.management.employeemanagement.service;

import com.management.employeemanagement.entity.Department;
import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.exception.ResourceNotFoundException;
import com.management.employeemanagement.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import com.management.employeemanagement.entity.Organization;
import com.management.employeemanagement.repository.OrganizationRepository;
@Service
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final OrganizationRepository organizationRepository;
    public DepartmentService(
            DepartmentRepository departmentRepository,
            OrganizationRepository organizationRepository) {

        this.departmentRepository = departmentRepository;
        this.organizationRepository = organizationRepository;
    }
    public Department saveDepartment(Long organizationId, Department department){

        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Organization not found"));

        department.setOrganization(organization);

        return departmentRepository.save(department);
    }
    public List<Department> getAllDepartment(Long organizationId){

        return departmentRepository.findByOrganizationId(organizationId);
    }
    public Department getDepartmentById(Long organizationId, Long departmentId){

        return departmentRepository
                .findByIdAndOrganizationId(departmentId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found"));
    }
    public Department updateDepartment(
            Long organizationId,
            Long departmentId,
            Department department){

        Department existingDepartment = departmentRepository
                .findByIdAndOrganizationId(departmentId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found"));

        existingDepartment.setName(department.getName());
        existingDepartment.setDescription(department.getDescription());

        return departmentRepository.save(existingDepartment);
    }
    public Department deleteDepartment(
            Long organizationId,
            Long departmentId){

        Department department = departmentRepository
                .findByIdAndOrganizationId(departmentId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found"));

        departmentRepository.delete(department);

        return department;
    }
}
