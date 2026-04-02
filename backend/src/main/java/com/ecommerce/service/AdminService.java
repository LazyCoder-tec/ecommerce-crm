package com.ecommerce.service;

import com.ecommerce.dto.OrderDto;
import com.ecommerce.entity.FollowUp;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CourseRepository;
import com.ecommerce.repository.FollowUpRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final OrderRepository orderRepository;
    private final FollowUpRepository followUpRepository;
    private final OrderService orderService;

    // ========== STATS ==========

    public Map<String, Object> getDashboardStats() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalCourses", courseRepository.count());
        stats.put("totalOrders", orderRepository.countSuccessfulOrders());
        stats.put("totalRevenue", orderRepository.sumTotalRevenue());
        stats.put("todayOrders", orderRepository.countTodayOrders(startOfDay));
        stats.put("todayRevenue", orderRepository.sumTodayRevenue(startOfDay));
        return stats;
    }

    public List<Map<String, Object>> getDailySales() {
        List<OrderDto> orders = orderService.getAllOrders();
        Map<String, Long> salesByDay = new LinkedHashMap<>();
        Map<String, Double> revenueByDay = new LinkedHashMap<>();

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd");

        // last 7 days
        for (int i = 6; i >= 0; i--) {
            String day = LocalDate.now().minusDays(i).format(fmt);
            salesByDay.put(day, 0L);
            revenueByDay.put(day, 0.0);
        }

        for (OrderDto o : orders) {
            if (o.getPurchasedAt() != null) {
                String day = o.getPurchasedAt().toLocalDate().format(fmt);
                salesByDay.merge(day, 1L, Long::sum);
                revenueByDay.merge(day, o.getAmount(), Double::sum);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        salesByDay.forEach((day, count) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("date", day);
            item.put("sales", count);
            item.put("revenue", revenueByDay.getOrDefault(day, 0.0));
            result.add(item);
        });
        return result;
    }

    // ========== USER MANAGEMENT ==========

    public List<Map<String, Object>> getAllUsersWithStats() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole().equals("ROLE_USER"))
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", user.getId());
                    map.put("name", user.getName());
                    map.put("email", user.getEmail());
                    map.put("banned", user.isBanned());
                    map.put("createdAt", user.getCreatedAt());
                    map.put("coursesPurchased",
                            orderRepository.countPurchasedCoursesByUserId(user.getId()));
                    return map;
                }).collect(Collectors.toList());
    }

    public Map<String, Object> toggleBan(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setBanned(!user.isBanned());
        userRepository.save(user);
        Map<String, Object> res = new HashMap<>();
        res.put("id", user.getId());
        res.put("banned", user.isBanned());
        res.put("message", user.isBanned() ? "User banned" : "User unbanned");
        return res;
    }

    // ========== CRM FOLLOW-UPS ==========

    public Map<String, Object> addFollowUp(Long userId, String note, String adminName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        FollowUp followUp = FollowUp.builder()
                .user(user).note(note).adminName(adminName)
                .build();
        FollowUp saved = followUpRepository.save(followUp);

        Map<String, Object> res = new HashMap<>();
        res.put("id", saved.getId());
        res.put("userId", userId);
        res.put("userName", user.getName());
        res.put("note", note);
        res.put("adminName", adminName);
        res.put("createdAt", saved.getCreatedAt());
        return res;
    }

    public List<Map<String, Object>> getFollowUps(Long userId) {
        return followUpRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(f -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", f.getId());
                    m.put("note", f.getNote());
                    m.put("adminName", f.getAdminName());
                    m.put("createdAt", f.getCreatedAt());
                    return m;
                }).collect(Collectors.toList());
    }
}
