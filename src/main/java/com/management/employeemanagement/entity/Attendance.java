package com.management.employeemanagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import java.time.LocalDate;
import java.time.LocalTime;
import jakarta.persistence.Table;
@Entity
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    private LocalDate date;
    private LocalTime checkIn;
    private LocalTime checkOut;
    @NotBlank(message = "Name is required")
    private String status;
   public LocalDate getDate(){
       return date;
   }
   public void setDate(LocalDate date){
       this.date=date;
   }
   public LocalTime getCheckIn(){
       return checkIn;
   }
   public void setCheckIn(LocalTime checkIn){
       this.checkIn=checkIn;
   }
    public LocalTime getCheckOut(){
       return checkOut;
    }
    public void setCheckOut(LocalTime checkOut){
       this.checkOut=checkOut;
    }
    public String getStatus(){
       return status;
    }
    public void setStatus(String status){
       this.status=status;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
