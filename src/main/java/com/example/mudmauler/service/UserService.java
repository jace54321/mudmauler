package com.example.mudmauler.service;

import com.example.mudmauler.entity.User;
import com.example.mudmauler.entity.Notification;
import com.example.mudmauler.repository.UserRepository;
import com.example.mudmauler.repository.NotificationRepository;
import com.example.mudmauler.dto.UpdateProfileRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User registerUser(User user) throws Exception {
        // Check if email exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email is already registered");
        }

        // Password hash
        user.setPassword(encoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        
        // Create notification for new user registration
        Notification notification = new Notification();
        notification.setMessage("New user registered: " + savedUser.getFirstName() + " " + savedUser.getLastName() + " (" + savedUser.getEmail() + ")");
        notification.setType("info");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
        
        return savedUser;
    }

    public User login(String email, String password) throws Exception {
        var userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new Exception("No user found with that email");
        }

        User user = userOpt.get();

        if (!encoder.matches(password, user.getPassword())) {
            throw new Exception("Incorrect password");
        }

        return user;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User updateUserProfile(Long id, UpdateProfileRequest request) throws Exception {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found"));

        // Check if email is being changed and if it's already taken
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new Exception("Email is already registered");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        return userRepository.save(user);
    }
}