package com.management.employeemanagement.service;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.management.employeemanagement.dto.LoginRequest;
import com.management.employeemanagement.dto.LoginResponse;
import com.management.employeemanagement.entity.Employee;
import com.management.employeemanagement.repository.EmployeeRepository;
import com.management.employeemanagement.security.JwtUtil;
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

        Employee employee = employeeRepository.findByName(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid Username"));

        if (!passwordEncoder.matches(request.getPassword(), employee.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtUtil.generateToken(
                employee.getEmail(),
                employee.getRole().name()
        );

        return new LoginResponse(token, "Login Successful");
    }
}
