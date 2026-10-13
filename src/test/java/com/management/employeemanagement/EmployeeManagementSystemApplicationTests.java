package com.management.employeemanagement;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class EmployeeManagementSystemApplicationTests {

	@Test
	void contextLoads() {
		org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder enc = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
		String hash = "$2a$10$XPY5TNE9W9yBTwlf9XK8LOOOf357C.8ZwtcXvebf6URVFYC6.L54O";
		String[] candidates = {"1234", "123456", "admin", "admin123", "vansh", "vansh123", "password", "root", "123", "qwerty"};
		for (String c : candidates) {
			if (enc.matches(c, hash)) {
				System.out.println(">>> MATCH FOUND FOR HASH: " + c);
			}
		}
	}
}
