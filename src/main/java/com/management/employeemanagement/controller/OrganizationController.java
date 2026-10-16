package com.management.employeemanagement.controller;

import com.management.employeemanagement.entity.Organization;
import com.management.employeemanagement.service.OrganizationService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/organization")
public class OrganizationController {
    private final OrganizationService organizationService;
    public OrganizationController(OrganizationService organizationService){
        this.organizationService=organizationService;
    }
    @PostMapping
    public Organization saveOrganization(@RequestBody Organization organization){
        return organizationService.saveOrganization(organization);
    }
    @GetMapping
    public List<Organization> getAllOrganization() {
        return organizationService.getAllOrganization();
    }
    @GetMapping("/{id}")
    public Organization getOrganizationById(@PathVariable Long id){
        return organizationService.getOrganizationById(id);
    }
    @PutMapping("/{id}")
    public Organization updateOrganization(
            @PathVariable Long id,
            @RequestBody Organization organization) {

        return organizationService.updateOrganization(id, organization);
    }
    @DeleteMapping("/{id}")
    public String deleteOrganization(@PathVariable Long id) {

        return organizationService.deleteOrganization(id);
    }
}
