package com.management.employeemanagement.controller;
import java.util.List;
import com.management.employeemanagement.entity.Employee;
import org.springframework.data.domain.Sort;
import com.management.employeemanagement.security.SecurityUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import com.management.employeemanagement.service.EmployeeService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;
@RestController
@RequestMapping("/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {

        this.employeeService = employeeService;
    }
    @PostMapping
    public Employee saveEmployee(@RequestBody Employee employee) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return employeeService.saveEmployee(organizationId, employee);
    }
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping
    public List<Employee> getAllEmployees() {

        Long organizationId = SecurityUtils.getOrganizationId();

        return employeeService.getAllEmployees(organizationId);
    }
    @GetMapping("/{employeeId}")
    public Employee getEmployeeById(@PathVariable Long employeeId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return employeeService.getEmployeeById(organizationId, employeeId);
    }
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PutMapping("/{employeeId}")
    public Employee updateEmployee(
            @PathVariable Long employeeId,
            @RequestBody Employee employee) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return employeeService.updateEmployee(
                organizationId,
                employeeId,
                employee
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{employeeId}")
    public String deleteEmployee(@PathVariable Long employeeId) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return employeeService.deleteEmployee(
                organizationId,
                employeeId
        );
    }
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping("/page")
    public Page<Employee> getEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Long organizationId = SecurityUtils.getOrganizationId();

        return employeeService.getEmployees(organizationId, page, size);
    }
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping("/organization/{organizationId}/sort")
    public List<Employee> sortEmployees(
            @PathVariable Long organizationId,
            @RequestParam String field) {

        return employeeService.sortEmployees(organizationId, field);
    }
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping("/organization/{organizationId}/search")
    public List<Employee> searchByName(
            @PathVariable Long organizationId,
            @RequestParam String name) {

        return employeeService.searchByName(organizationId, name);
    }
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    @PostMapping(
            value = "/{id}/upload-photo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        return ResponseEntity.ok(employeeService.uploadPhoto(id, file));
    }
    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    @GetMapping("/{id}/photo")
    public ResponseEntity<Resource> getPhoto(@PathVariable Long id) throws IOException {
        return employeeService.getPhoto(id);
    }
}

