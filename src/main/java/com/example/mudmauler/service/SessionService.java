package com.example.mudmauler.service;

import com.example.mudmauler.entity.Session;
import com.example.mudmauler.entity.Notification;
import com.example.mudmauler.entity.User;
import com.example.mudmauler.repository.SessionRepository;
import com.example.mudmauler.repository.NotificationRepository;
import com.example.mudmauler.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

@Service
public class SessionService {
    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public Session createSession(Long userId) {
        String sessionId = UUID.randomUUID().toString();
        Session session = new Session();
        session.setSessionId(sessionId);
        session.setUserId(userId);
        session.setCreatedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusHours(8)); // Session duration
        Session savedSession = sessionRepository.save(session);
        
        // Create notification for user login
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Notification notification = new Notification();
            notification.setMessage("User logged in: " + user.getFirstName() + " " + user.getLastName() + " (" + user.getEmail() + ")");
            notification.setType("info");
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);
            notificationRepository.save(notification);
        }
        
        return savedSession;
    }

    public boolean isSessionValid(String sessionId) {
        Session session = sessionRepository.findBySessionId(sessionId);
        return session != null && session.getExpiresAt().isAfter(LocalDateTime.now());
    }

    public void deleteSession(String sessionId) {
        sessionRepository.deleteBySessionId(sessionId);
    }

    public Long getUserIdBySessionId(String sessionId) {
        Session session = sessionRepository.findBySessionId(sessionId);
        if (session != null && session.getExpiresAt().isAfter(LocalDateTime.now())) {
            return session.getUserId();
        }
        return null;
    }

    public void deleteSessionsByUserId(Long userId) {
        List<Session> sessions = sessionRepository.findAll().stream()
                .filter(s -> s.getUserId().equals(userId))
                .collect(java.util.stream.Collectors.toList());
        sessionRepository.deleteAll(sessions);
    }
}

