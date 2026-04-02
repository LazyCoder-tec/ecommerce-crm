package com.ecommerce.service;

import com.ecommerce.dto.FeedbackDtos.*;
import com.ecommerce.entity.Course;
import com.ecommerce.entity.Feedback;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CourseRepository;
import com.ecommerce.repository.FeedbackRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public FeedbackDto submitFeedback(Long userId, FeedbackRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (feedbackRepository.existsByUserIdAndCourseId(userId, request.getCourseId())) {
            throw new BadRequestException("You have already submitted feedback for this course");
        }

        Feedback feedback = Feedback.builder()
                .user(user).course(course)
                .message(request.getMessage())
                .rating(request.getRating())
                .build();

        return toDto(feedbackRepository.save(feedback));
    }

    public List<FeedbackDto> getAllFeedback() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public FeedbackDto markAsRead(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));
        feedback.setRead(true);
        return toDto(feedbackRepository.save(feedback));
    }

    private FeedbackDto toDto(Feedback f) {
        return FeedbackDto.builder()
                .id(f.getId())
                .userId(f.getUser().getId())
                .userName(f.getUser().getName())
                .userEmail(f.getUser().getEmail())
                .courseId(f.getCourse().getId())
                .courseTitle(f.getCourse().getTitle())
                .message(f.getMessage())
                .rating(f.getRating())
                .read(f.isRead())
                .createdAt(f.getCreatedAt())
                .build();
    }
}
