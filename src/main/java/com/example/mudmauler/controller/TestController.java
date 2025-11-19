package com.example.mudmauler.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend to connect
@RestController
@RequestMapping("/api")
public class TestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/test")
    public ResponseEntity<?> insertTest(@RequestBody Map<String, String> payload) {
        String value = payload.get("value");
        jdbcTemplate.update("INSERT INTO test_table (test_value) VALUES (?)", value);
        return ResponseEntity.ok().build();
    }
}
