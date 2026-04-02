package com.ecommerce.service;

import com.ecommerce.dto.PaymentDtos.*;
import com.ecommerce.entity.Course;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CourseRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final OrderRepository orderRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public PaymentIntentResponse createPaymentIntent(PaymentIntentRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Check if already purchased
        boolean alreadyPurchased = orderRepository.existsByUserIdAndCourseIdAndStatus(
                user.getId(), course.getId(), "SUCCESS");
        if (alreadyPurchased) {
            throw new BadRequestException("You have already purchased this course");
        }

        try {
            // Amount in paise (INR) - multiply price by 100
            long amountInPaise = (long) (course.getPrice() * 100);

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInPaise)
                    .setCurrency("inr")
                    .putMetadata("courseId", course.getId().toString())
                    .putMetadata("userId", user.getId().toString())
                    .putMetadata("courseTitle", course.getTitle())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            // Save pending order
            Order order = Order.builder()
                    .user(user)
                    .course(course)
                    .paymentIntentId(intent.getId())
                    .amount(course.getPrice())
                    .status("PENDING")
                    .build();
            orderRepository.save(order);

            return PaymentIntentResponse.builder()
                    .clientSecret(intent.getClientSecret())
                    .paymentIntentId(intent.getId())
                    .amount(course.getPrice())
                    .currency("inr")
                    .build();

        } catch (StripeException e) {
            throw new RuntimeException("Stripe error: " + e.getMessage());
        }
    }

    public void confirmPayment(ConfirmPaymentRequest request) {
        Order order = orderRepository.findByPaymentIntentId(request.getPaymentIntentId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus("SUCCESS");
        orderRepository.save(order);
    }
}
