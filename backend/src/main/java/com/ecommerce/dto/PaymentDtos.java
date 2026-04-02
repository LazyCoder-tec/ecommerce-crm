package com.ecommerce.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

public class PaymentDtos {

    @Data
    public static class PaymentIntentRequest {
        private Long courseId;
        private Long userId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentIntentResponse {
        private String clientSecret;
        private String paymentIntentId;
        private Double amount;
        private String currency;
    }

    @Data
    public static class ConfirmPaymentRequest {
        private String paymentIntentId;
        private Long courseId;
        private Long userId;
    }
}
