package com.ecommerce.controller;

import com.ecommerce.dto.FeedbackDtos.*;
import com.ecommerce.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> submit(
            @PathVariable Long userId,
            @RequestBody FeedbackRequest request) {
        FeedbackDto dto = feedbackService.submitFeedback(userId, request);
        return ResponseEntity.ok(Map.of(
                "feedback", dto,
                "message", "Feedback submitted successfully!"
        ));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<FeedbackDto>> getAll() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<FeedbackDto> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.markAsRead(id));
    }
}
