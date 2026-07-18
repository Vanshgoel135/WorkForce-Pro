package com.management.employeemanagement.service;

import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.repository.EmployeeRepository;
import com.management.employeemanagement.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

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
    public String uploadPhoto(Long id, MultipartFile file) throws IOException {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        String uploadDir = "uploads/";

        Files.createDirectories(Paths.get(uploadDir));

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path filePath = Paths.get(uploadDir, fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        employee.setProfilePhoto(fileName);

        employeeRepository.save(employee);

        return "Photo uploaded successfully.";
    }
    public ResponseEntity<Resource> getPhoto(Long id) throws IOException {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        Path path = Paths.get("uploads").resolve(employee.getProfilePhoto());

        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            throw new ResourceNotFoundException("Photo not found");
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(resource);
    }
}


