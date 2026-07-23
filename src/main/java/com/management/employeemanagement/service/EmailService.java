package com.management.employeemanagement.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendWelcomeEmail(String toEmail, String employeeName) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Welcome to WorkForce Pro");

        message.setText(
                "Dear " + employeeName + ",\n\n" +

                        "Welcome to WorkForce Pro!\n\n" +

                        "We are delighted to have you as a part of our organization. Your employee account has been created successfully, and you are now officially registered in the WorkForce Pro Employee Management System.\n\n" +

                        "We hope you have a rewarding and successful journey with us. We encourage you to explore the platform and make use of its features to manage your work efficiently.\n\n" +

                        "If you have any questions or require assistance, please feel free to contact the HR Team. We are always happy to help.\n\n" +

                        "Once again, welcome aboard! We wish you great success and look forward to working with you.\n\n" +

                        "Best Regards,\n" +
                        "HR Team\n" +
                        "WorkForce Pro"
        );

        mailSender.send(message);
    }

    public void sendLeaveApprovedEmail(String toEmail, String employeeName) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Leave Approved");

        message.setText(
                "Hello " + employeeName + ",\n\n" +
                        "Congratulations!\n\n" +
                        "Your leave request has been approved.\n\n" +
                        "Regards,\nHR Team"
        );

        mailSender.send(message);
    }

    public void sendLeaveRejectedEmail(String toEmail, String employeeName) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Leave Rejected");

        message.setText(
                "Hello " + employeeName + ",\n\n" +
                        "We are sorry.\n\n" +
                        "Your leave request has been rejected.\n\n" +
                        "Regards,\nHR Team"
        );

        mailSender.send(message);
    }
}