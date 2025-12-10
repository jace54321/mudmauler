package com.example.mudmauler.controller;

import com.example.mudmauler.entity.User;
import com.example.mudmauler.entity.Session;
import com.example.mudmauler.service.UserService;
import com.example.mudmauler.service.SessionService;
import com.example.mudmauler.dto.UpdateProfileRequest;

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

    // -------------------------
    // REGISTER
    // -------------------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // -------------------------
    // LOGIN — RETURN FULL USER INFO
    // -------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getEmail(), request.getPassword());
            Session session = sessionService.createSession(user.getId());

            // Return full profile to frontend
            LoginResponse response = new LoginResponse(
                    "Login successful",
                    session.getSessionId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getAddress(),
                    "",   // avatar placeholder
                    user.getRole()  // user role
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(401).body(new ErrorResponse(e.getMessage()));
        }
    }

    // -------------------------
    // LOGOUT
    // -------------------------
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Session-Id") String sessionId) {
        sessionService.deleteSession(sessionId);
        return ResponseEntity.ok(new ErrorResponse("Logged out successfully"));
    }

    // -------------------------
    // GET PROFILE
    // -------------------------
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader(value = "Session-Id", required = false) String sessionId) {
        try {
            if (sessionId == null || sessionId.isEmpty()) {
                return ResponseEntity.status(401).body(new ErrorResponse("Session required"));
            }

            Long userId = sessionService.getUserIdBySessionId(sessionId);
            if (userId == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("Invalid session"));
            }

            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // -------------------------
    // UPDATE PROFILE
    // -------------------------
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @RequestBody UpdateProfileRequest request) {
        try {
            if (sessionId == null || sessionId.isEmpty()) {
                return ResponseEntity.status(401).body(new ErrorResponse("Session required"));
            }

            Long userId = sessionService.getUserIdBySessionId(sessionId);
            if (userId == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("Invalid session"));
            }

            User user = userService.updateUserProfile(userId, request);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // ----------------------------------------------------
    // DTO CLASSES
    // ----------------------------------------------------

    static class ErrorResponse {
        private String message;
        public ErrorResponse(String msg) { this.message = msg; }
        public String getMessage() { return message; }
    }

    static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    static class LoginResponse {
        private String message;
        private String sessionId;

        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String address;
        private String avatar;
        private String role;

        public LoginResponse(
                String message,
                String sessionId,
                String firstName,
                String lastName,
                String email,
                String phone,
                String address,
                String avatar,
                String role
        ) {
            this.message = message;
            this.sessionId = sessionId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phone = phone;
            this.address = address;
            this.avatar = avatar;
            this.role = role;
        }

        public String getMessage() { return message; }
        public String getSessionId() { return sessionId; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public String getAddress() { return address; }
        public String getAvatar() { return avatar; }
        public String getRole() { return role; }
    }

}
