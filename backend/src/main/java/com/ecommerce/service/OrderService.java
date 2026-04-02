package com.ecommerce.service;

import com.ecommerce.dto.CourseDto;
import com.ecommerce.dto.OrderDto;
import com.ecommerce.entity.Order;
import com.ecommerce.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CourseService courseService;

    public List<CourseDto> getMyCourses(Long userId) {
        return orderRepository.findSuccessfulOrdersByUserId(userId)
                .stream()
                .map(order -> courseService.toDto(order.getCourse()))
                .collect(Collectors.toList());
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllSuccessfulOrders()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public OrderDto toDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userName(order.getUser().getName())
                .userEmail(order.getUser().getEmail())
                .courseId(order.getCourse().getId())
                .courseTitle(order.getCourse().getTitle())
                .coursePrice(order.getCourse().getPrice())
                .paymentIntentId(order.getPaymentIntentId())
                .amount(order.getAmount())
                .status(order.getStatus())
                .purchasedAt(order.getPurchasedAt())
                .build();
    }
}
