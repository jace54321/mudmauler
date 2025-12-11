package com.example.mudmauler.repository;

import com.example.mudmauler.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Standard JPA methods like save() are included automatically
}