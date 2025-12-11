package com.example.mudmauler.repository;

import com.example.mudmauler.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByIsReadOrderByCreatedAtDesc(boolean isRead);
    List<Notification> findAllByOrderByCreatedAtDesc();
}

