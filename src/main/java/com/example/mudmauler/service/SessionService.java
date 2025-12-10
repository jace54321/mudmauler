package com.example.mudmauler.service;

import com.example.mudmauler.entity.Session;
import com.example.mudmauler.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class SessionService {
    @Autowired
    private SessionRepository sessionRepository;

    public Session createSession(Long userId) {
        String sessionId = UUID.randomUUID().toString();
        Session session = new Session();
        session.setSessionId(sessionId);
        session.setUserId(userId);
        session.setCreatedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusHours(8)); // Session duration
        return sessionRepository.save(session);
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
}
