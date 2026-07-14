package com.management.employeemanagement.entity;

import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDate;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
@Entity
@Table(name = "leave_requests")
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String reason;
    private String status;
public Long getId(){
    return id;
}
public void setId(Long id){
    this.id=id;
}
public Employee getEmployee(){
    return employee;
}
public void setEmployee(Employee employee){
    this.employee=employee;
}
public  LocalDate getFromDate(){
    return fromDate;
}
public void setFromDate( LocalDate fromDate){
    this.fromDate=fromDate;
}
public  LocalDate getToDate(){
    return toDate;
}
public void setToDate( LocalDate toDate){
    this.toDate=toDate;
}
public String getStatus(){
    return status;
}
public void setStatus(String status){
    this.status=status;
}
public String getReason(){
    return reason;
}
public void setReason(String reason){
    this.reason=reason;
}
}
