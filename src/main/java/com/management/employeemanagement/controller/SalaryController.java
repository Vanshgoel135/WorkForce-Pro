package com.management.employeemanagement.controller;

import com.management.employeemanagement.repository.SalaryRepository;
import com.management.employeemanagement.service.SalaryService;
import jakarta.validation.Valid;
import com.management.employeemanagement.entity.Salary;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/salary")
public class SalaryController {
    private final SalaryService salaryService;
    public SalaryController(SalaryService salaryService){
        this.salaryService = salaryService;
    }
    @PostMapping("/{employeeId}")
    public Salary addSalary(@PathVariable Long employeeId,@Valid @RequestBody Salary salary){
        return salaryService.addSalary(employeeId ,salary);
    }
    @GetMapping
    public List<Salary> getAllSalary(){
        return salaryService.getAllSalary();
    }
    @GetMapping("/{id}")
    public Salary getSalaryById(@PathVariable Long id){
        return salaryService.getSalaryById(id);
    }
    @GetMapping("/employee/{employeeId}")
    public List<Salary> getSalaryByEmployeeId(@PathVariable Long employeeId) {
        return salaryService.getSalaryByEmployeeId(employeeId);
    }
    @PutMapping("/{id}")
    public Salary updateSalary(@PathVariable Long id,@Valid @RequestBody Salary salary){
        return salaryService.updateSalary(id,salary);
    }
    @DeleteMapping("/{id}")
    public String deleteSalary(@PathVariable Long id) {

        salaryService.deleteSalary(id);

        return "Salary deleted successfully";
    }
}
