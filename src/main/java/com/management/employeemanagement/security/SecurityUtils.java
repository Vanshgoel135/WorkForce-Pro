package com.management.employeemanagement.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static Long getOrganizationId() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return (Long) authentication.getCredentials();
    }
}