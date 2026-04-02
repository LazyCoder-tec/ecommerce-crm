package com.ecommerce.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

public class FeedbackDtos {

    @Data
    public static class FeedbackRequest {
        private Long courseId;
        private String message;
        private Integer rating;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeedbackDto {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private Long courseId;
        private String courseTitle;
        private String message;
        private Integer rating;
        private boolean read;
        private LocalDateTime createdAt;
    }
}
