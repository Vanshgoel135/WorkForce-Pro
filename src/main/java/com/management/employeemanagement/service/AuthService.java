package com.management.employeemanagement.service;

import com.management.employeemanagement.dto.LoginRequest;
import com.management.employeemanagement.dto.LoginResponse;
import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.repository.EmployeeRepository;
import com.management.employeemanagement.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(EmployeeRepository employeeRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {

        System.out.println("========== LOGIN START ==========");

        System.out.println("Email = " + request.getUsername());

        Employee employee = employeeRepository
                .findByEmail(request.getUsername())
                .orElse(null);

        System.out.println("Employee = " + employee);

        if (employee == null) {
            throw new RuntimeException("Invalid Email");
        }

        System.out.println("DB Password = " + employee.getPassword());
        System.out.println("User Password = " + request.getPassword());

        boolean match = passwordEncoder.matches(
                request.getPassword(),
                employee.getPassword()
        );

        System.out.println("Password Match = " + match);

        if (!match) {
            throw new RuntimeException("Invalid Password");
        }

        System.out.println("Role = " + employee.getRole());

        String token = jwtUtil.generateToken(
                employee.getEmail(),
                employee.getRole().name(),
                employee.getOrganization().getId()
        );

        System.out.println("Token Generated Successfully");
        System.out.println("JWT = " + token);

        System.out.println("========== LOGIN SUCCESS ==========");

        return new LoginResponse(token, "Login Successful");
    }
}