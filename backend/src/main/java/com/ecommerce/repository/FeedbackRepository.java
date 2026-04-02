package com.ecommerce.repository;

import com.ecommerce.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findAllByOrderByCreatedAtDesc();
    List<Feedback> findByUserId(Long userId);
    List<Feedback> findByCourseId(Long courseId);
    List<Feedback> findByIsRead(boolean isRead);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
}
