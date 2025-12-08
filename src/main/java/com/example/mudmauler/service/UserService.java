package com.example.mudmauler.service;

import com.example.mudmauler.entity.User;
import com.example.mudmauler.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User registerUser(User user) throws Exception {
        // Check if email exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email is already registered");
        }

        // Password hash
        user.setPassword(encoder.encode(user.getPassword()));

        return userRepository.save(user);
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
}