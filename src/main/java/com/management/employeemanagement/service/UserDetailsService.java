package com.management.employeemanagement.service;
import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.repository.EmployeeRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;

    public CustomUserDetailsService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {

        Employee employee = employeeRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));

        return new org.springframework.security.core.userdetails.User(
                employee.getUsername(),
                employee.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + employee.getRole().name()))
        );
    }
}