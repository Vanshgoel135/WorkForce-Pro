package com.management.employeemanagement.service;

import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.exception.ResourceNotFoundException;
import com.management.employeemanagement.repository.EmployeeRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.management.employeemanagement.entity.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.management.employeemanagement.entity.Organization;
import java.util.List;
import java.io.IOException;
import java.nio.file.*;
import com.management.employeemanagement.repository.OrganizationRepository;
@Service
public class EmployeeService {
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;
    private final EmailService emailService;
    private final OrganizationRepository organizationRepository;
    public EmployeeService(EmployeeRepository employeeRepository,
                           EmailService emailService,
                           PasswordEncoder passwordEncoder,
                           OrganizationRepository organizationRepository ) {

        this.employeeRepository = employeeRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.organizationRepository = organizationRepository;
    }

    // Save Employee + Send Welcome Email
    public Employee saveEmployee(Long organizationId, Employee employee) {

        // Find Organization
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Organization not found"));

        // Attach Organization
        employee.setOrganization(organization);

        // Default Role
        if (employee.getRole() == null) {
            employee.setRole(Role.EMPLOYEE);
        }

        // Encode Password
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));

        // Save Employee
        Employee savedEmployee = employeeRepository.save(employee);

        // Send Welcome Email
        emailService.sendWelcomeEmail(
                savedEmployee.getEmail(),
                savedEmployee.getName()
        );

        return savedEmployee;
    }
    // Get All Employees
    public List<Employee> getAllEmployees(Long organizationId) {

        return employeeRepository.findByOrganizationId(organizationId);
    }
    public Employee getEmployeeById(Long organizationId, Long employeeId) {

        return employeeRepository
                .findByIdAndOrganizationId(employeeId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));
    }

    // Update Employee
    public Employee updateEmployee(Long organizationId, Long employeeId, Employee employee) {

        Employee existingEmployee = employeeRepository
                .findByIdAndOrganizationId(employeeId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        existingEmployee.setName(employee.getName());
        existingEmployee.setEmail(employee.getEmail());
        existingEmployee.setDepartment(employee.getDepartment());
        existingEmployee.setSalary(employee.getSalary());
        existingEmployee.setDateOfJoining(employee.getDateOfJoining());

        return employeeRepository.save(existingEmployee);
    }

    // Delete Employee
    public String deleteEmployee(Long organizationId, Long employeeId) {

        Employee employee = employeeRepository
                .findByIdAndOrganizationId(employeeId, organizationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        employeeRepository.delete(employee);

        return "Employee Deleted Successfully";
    }

    // Pagination
    public Page<Employee> getEmployees(Long organizationId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return employeeRepository.findByOrganizationId(organizationId, pageable);
    }

    // Sorting
    public List<Employee> sortEmployees(Long organizationId, String field) {

        return employeeRepository.findByOrganizationId(
                organizationId,
                Sort.by(field)
        );
    }

    // Search
    public List<Employee> searchByName(Long organizationId, String name) {

        return employeeRepository.findByNameAndOrganizationId(
                name,
                organizationId
        );
    }

    // Upload Photo
    public String uploadPhoto(Long id, MultipartFile file) throws IOException {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        String uploadDir = "uploads/";

        Files.createDirectories(Paths.get(uploadDir));

        String fileName = System.currentTimeMillis() + "_"
                + file.getOriginalFilename();

        Path filePath = Paths.get(uploadDir, fileName);

        Files.copy(file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING);

        employee.setProfilePhoto(fileName);

        employeeRepository.save(employee);

        return "Photo uploaded successfully.";
    }

    // View Photo
    public ResponseEntity<Resource> getPhoto(Long id) throws IOException {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        Path path = Paths.get("uploads")
                .resolve(employee.getProfilePhoto());

        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            throw new ResourceNotFoundException("Photo not found");
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(resource);
    }
}