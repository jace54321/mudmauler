package com.example.mudmauler.repository;

import com.example.mudmauler.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, String> {
    Session findBySessionId(String sessionId);
    void deleteBySessionId(String sessionId);
}
