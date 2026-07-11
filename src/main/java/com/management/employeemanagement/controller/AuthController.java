package com.management.employeemanagement.controller;

import com.management.employeemanagement.dto.LoginRequest;
import com.management.employeemanagement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    private static final String API_PASSWORD = "Vansh@123";

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        // Password check
        if (!API_PASSWORD.equals(request.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid Password"
            );
        }

        // Username kuch bhi ho sakta hai
        return jwtUtil.generateToken(request.getUsername());
    }
}