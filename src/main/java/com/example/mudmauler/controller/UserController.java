package com.example.mudmauler.controller;

import com.example.mudmauler.entity.User;
import com.example.mudmauler.entity.Session; // Add your Session entity
import com.example.mudmauler.service.UserService;
import com.example.mudmauler.service.SessionService; // Add your SessionService

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private SessionService sessionService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.ok().body("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    static class ErrorResponse {
        private String message;
        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }

    static class LoginResponse {
        private String message;
        private String sessionId;
        public LoginResponse(String message, String sessionId) {
            this.message = message;
            this.sessionId = sessionId;
        }
        public String getMessage() { return message; }
        public String getSessionId() { return sessionId; }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
            // When login successful, create and return session
            Session session = sessionService.createSession(user.getId());
            return ResponseEntity.ok().body(new LoginResponse("Login successful!", session.getSessionId()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Session-Id") String sessionId) {
        sessionService.deleteSession(sessionId);
        return ResponseEntity.ok().body(new ErrorResponse("Logged out successfully!"));
    }

    static class LoginRequest {
        private String email;
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

}
