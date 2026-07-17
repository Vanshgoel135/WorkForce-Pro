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
@Table(name="Salary")
public class Salary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private Double basicSalary;

    private Double bonus;

    private Double deduction;

    private Double netSalary;

    private LocalDate payDate;
    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id=id;
    }
    public Employee setEmployee(){
        return employee;
    }
    public void setEmployee(Employee employee){
        this.employee=employee;
    }
    public Double getBasicSalary(){
        return basicSalary;
    }
    public void setBasicSalary(Double basicSalary){
        this.basicSalary=basicSalary;
    }
    public Double getDeduction(){
        return deduction;
    }
    public void setDeduction(Double deduction){
        this.deduction=deduction;
    }
    public Double getNetSalary(){
        return netSalary;
    }
    public void setNetSalary(Double netSalary){
        this.netSalary=netSalary;
    }
    public Double getBonus(){
        return bonus;
    }
    public void setBonus(Double bonus){
        this.bonus=bonus;
    }
    public LocalDate getPayDate(){
        return payDate;
    }
    public void setPayDate(LocalDate payDate){
        this.payDate=payDate;
    }
}
