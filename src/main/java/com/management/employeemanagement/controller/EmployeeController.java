package com.management.employeemanagement.controller;
import java.util.List;
import com.management.employeemanagement.entity.Employee;
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
    public Employee addemployee( @Valid @RequestBody Employee employee){
        return employeeService.saveEmployee(employee);
    }
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }
    @GetMapping("/{id}")
public Employee getEmployeeById(@PathVariable Long id){
        return employeeService.getEmployeeById(id);
    }
    @PutMapping("/{id}")
    public Employee updateEmployees( @Valid @PathVariable Long id,@RequestBody Employee employee){
        return employeeService.updateEmployee(id, employee);
    }
    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable Long id)
    {
        return employeeService.deleteEmployee(id);
    }
    @GetMapping("/page")
    public Page<Employee> getEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return employeeService.getEmployees(page, size);
    }
    @GetMapping("/sort")
    public List<Employee> sortEmployees(
            @RequestParam String field) {

        return employeeService.sortEmployees(field);
    }
    @GetMapping("/search")
    public List<Employee> searchByName(@RequestParam String name) {
        return employeeService.searchByName(name);
    }
    @PostMapping(
            value = "/{id}/upload-photo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        return ResponseEntity.ok(employeeService.uploadPhoto(id, file));
    }
    @GetMapping("/{id}/photo")
    public ResponseEntity<Resource> getPhoto(@PathVariable Long id) throws IOException {
        return employeeService.getPhoto(id);
    }
}

