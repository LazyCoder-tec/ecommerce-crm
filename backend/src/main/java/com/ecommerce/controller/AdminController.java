package com.ecommerce.controller;

import com.ecommerce.dto.OrderDto;
import com.ecommerce.service.AdminService;
import com.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;

    // ── Dashboard ──────────────────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/sales/daily")
    public ResponseEntity<List<Map<String, Object>>> getDailySales() {
        return ResponseEntity.ok(adminService.getDailySales());
    }

    @GetMapping("/sales/all")
    public ResponseEntity<List<OrderDto>> getAllSales() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ── Customer Management ────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsersWithStats());
    }

    @PatchMapping("/users/{userId}/ban")
    public ResponseEntity<Map<String, Object>> toggleBan(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.toggleBan(userId));
    }

    // ── CRM Follow-ups ─────────────────────────────────────
    @PostMapping("/followups")
    public ResponseEntity<Map<String, Object>> addFollowUp(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        Long userId = Long.valueOf(body.get("userId").toString());
        String note = body.get("note").toString();
        String adminName = auth.getName();
        return ResponseEntity.ok(adminService.addFollowUp(userId, note, adminName));
    }

    @GetMapping("/followups/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getFollowUps(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.getFollowUps(userId));
    }
}
