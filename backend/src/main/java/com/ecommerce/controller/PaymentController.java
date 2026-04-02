package com.ecommerce.controller;

import com.ecommerce.dto.PaymentDtos.*;
import com.ecommerce.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponse> createIntent(
            @RequestBody PaymentIntentRequest request) {
        return ResponseEntity.ok(paymentService.createPaymentIntent(request));
    }

    @PostMapping("/confirm")
    public ResponseEntity<Map<String, String>> confirmPayment(
            @RequestBody ConfirmPaymentRequest request) {
        paymentService.confirmPayment(request);
        return ResponseEntity.ok(Map.of("message", "Payment confirmed! Course added to your library."));
    }
}
