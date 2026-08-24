package com.management.employeemanagement.controller;

import com.management.employeemanagement.dto.LoginRequest;
import com.management.employeemanagement.dto.LoginResponse;
import com.management.employeemanagement.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}