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

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already in use");
        }

        // Hash password
        user.setPassword(encoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public User login(String email, String password) throws Exception {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("No user found with this email"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid password");
        }

        return user;
    }
}
