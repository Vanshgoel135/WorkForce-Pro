package com.management.employeemanagement.service;

import com.management.employeemanagement.entity.Organization;
import com.management.employeemanagement.repository.OrganizationRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class OrganizationService {
    private final OrganizationRepository organizationRepository;
    public OrganizationService(OrganizationRepository organizationRepository){
        this.organizationRepository=organizationRepository;
    }
public Organization saveOrganization(Organization organization){
        return organizationRepository.save(organization);
}
public List<Organization>getAllOrganization(){
        return organizationRepository.findAll();
}
public Organization getOrganizationById(Long id){
        return organizationRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Organization Not Found")
        );
}
    public Organization updateOrganization(Long id, Organization organization) {

        Organization existingOrganization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization Not Found"));

        existingOrganization.setName(organization.getName());
        existingOrganization.setEmail(organization.getEmail());
        existingOrganization.setPhone(organization.getPhone());
        existingOrganization.setAddress(organization.getAddress());
        existingOrganization.setCreatedAt(organization.getCreatedAt());

        return organizationRepository.save(existingOrganization);
    }
    public String deleteOrganization(Long id) {

        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization Not Found"));

        organizationRepository.delete(organization);

        return "Organization Deleted Successfully";
    }
}
