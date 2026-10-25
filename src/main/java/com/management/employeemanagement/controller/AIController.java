package com.management.employeemanagement.controller;

import com.management.employeemanagement.service.AIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public String chat(@RequestBody String prompt) {
        return aiService.askAI(prompt);
    }
}