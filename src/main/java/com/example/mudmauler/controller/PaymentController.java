package com.example.mudmauler.controller;

import com.example.mudmauler.dto.PaymentRequest;
import com.example.mudmauler.entity.Payment;
import com.example.mudmauler.service.PaymentService;
// Removed jakarta.validation.Valid import

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    // Removed @Valid annotation
    public ResponseEntity<Payment> processPayment(@RequestBody PaymentRequest request) {
        try {
            Payment newPayment = paymentService.createPayment(request);
            return new ResponseEntity<>(newPayment, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Log the exception details here
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}